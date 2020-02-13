//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers summary view
//

import React from 'react';
import { connect } from 'react-redux';
import { ContainerLayout, StackingLayout, Title, Table, ThemeManager } from 'prism-reactjs';
import AppUtil from '../utils/AppUtil';
import i18n from '../utils/i18n';


// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServerSummary', key, defaultValue, replacedValue);

class FileServerSummary extends React.Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      alertColors: {
        info: 'light-gray-1',
        warning: 'yellow-1',
        critical: 'red-1'
      },
      summaryData: {},
      tableStructure: {
        hideHeader: true,
        columnWidths: {
          title: '60%'
        }
      },
      tableColumns: [
        {
          title: i18nT('fileServers', 'File servers'),
          key: 'title'
        },
        {
          title: i18nT('critical', 'Critical'),
          key: 'critical',
          render: this.renderAlertCell.bind(this, 'critical')
        },
        {
          title: i18nT('warning', 'Warning'),
          key: 'warning',
          render: this.renderAlertCell.bind(this, 'warning')
        },
        {
          title: i18nT('info', 'Info'),
          key: 'info',
          render: this.renderAlertCell.bind(this, 'info')
        }
      ],
      tableDataSource: []
    };
  }

  renderAlertCell(alertSeverity, cellData) {
    return (
      <span style={
        {
          display: 'flex',
          alignItems: 'center'
        }
      }
      >
        <span style={
          {
            width: '6px',
            height: '6px',
            backgroundColor: ThemeManager.getVar(this.state.alertColors[alertSeverity]),
            borderRadius: '3px',
            display: 'inline-flex',
            marginRight: '10px'
          }
        }
        />
        { cellData }
      </span>
    );
  }

  render() {
    let tableTitle = i18nT('highlightedFileServers', 'Highlighted file servers');
    if (this.state.summaryData.total) {
      tableTitle += ` (${this.state.summaryData.total})`;
    }
    tableTitle = (
      <Title size="h3">
        { tableTitle }
      </Title>
    );

    return (
      <StackingLayout padding="20px">
        <ContainerLayout backgroundColor="white" padding="15px">
          <Table
            border={ false }
            loading={ this.state.loading }
            structure={ this.state.tableStructure }
            topSection={
              {
                leftContent: tableTitle
              }
            }
            oldTable={ false }
            rowKey="entity_id"
            columns={ this.state.tableColumns }
            dataSource={ this.state.tableDataSource }
          />
        </ContainerLayout>
      </StackingLayout>
    );
  }

  componentWillMount() {
    // Fetch aggregated file server summary data
    AppUtil.fetchSummaryFSData()
      .then(
        (summaryData) => {
          // Set the datasource for the table
          this.setState({
            loading: false,
            summaryData,
            tableDataSource: summaryData.items
          });
        })
      .catch(() => {
        this.setState({
          loading: false,
          tableDataSource: [],
          errorMessage: i18nT('errorFetchingPolicies', 'Error fetching File Servers') });
      });
  }

}


FileServerSummary.propTypes = {

};

export default connect(
  null,
)(FileServerSummary);
