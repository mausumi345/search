//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers main view
//
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Table, Sorter
} from 'prism-reactjs';
import i18n from '../utils/i18n';


// Actions
import {
  openModal,
 // fetchFsData
} from '../actions';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'SearchDetails', key, defaultValue, replacedValue);
const DURATION = 30000;

const columns = [{
  title: 'FileName',
  id: 'fileName'
}, {
  title: 'FilePath',
  id: 'filePath'
}];

const data = [];
for (var i = 0; i < 100; i++) {
  data.push({
    id: i,
    name: 'name' + i,
    age: i,
    address: 'address' + i
  });
}


class SearchDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: data,
      loading: false,
      pagination: {
        total: 100,
        pageSize: 10,
        currentPage: 1,
        pageSizeOptions: [5, 10, 15]
      },
      sort: {
        order: Sorter.SORT_ORDER_CONST.ASCEND,
        column: 'age',
        sortable: ['age', 'name', 'address']
      }
    };
    this.handleChangePagination = this.handleChangePagination.bind(this);
    this.handleChangeSort = this.handleChangeSort.bind(this);
  }
  getData(pagination, sort) {
    let newData = data.slice(0);

    // Sort logic
    newData.sort((a, b) => {
      const sortOrder = sort.order;
      let result;
      switch (this.state.sort.column) {
        case 'age':
          result = a.age - b.age;
          break;
        case 'name':
          result = a.name.localeCompare(b.name);
          break;
        case 'address':
          result = a.address.localeCompare(b.address);
          break;
        default:
          break;
      }
      if (result !== 0) {
        return (sortOrder === Sorter.SORT_ORDER_CONST.DESCEND) ? -result : result;
      }
      return 0;
    });

    // Pagination logic
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    newData = newData.slice(startIndex, endIndex);

    return newData;
  }
  fetchData(pagination, sort) {
    this.setState({ loading: true });
    setTimeout(() => {
      const newState = {};

      newState.loading = false;
      newState.pagination = pagination || this.state.pagination;
      newState.sort = sort || this.state.sort;
      newState.dataSource = this.getData(newState.pagination, newState.sort);

      this.setState(newState);
    }, 2000);
  }
  handleChangePagination(pagination) {
    this.fetchData(pagination, null);
  }
  handleChangeSort(sort) {
    this.fetchData(null, sort);
  }

  render() {
    const {
      dataSource,
      loading,
      pagination,
      sort
    } = this.state;

    const topSection = {
      title: 'Header title',
      leftContent: <div>Left content</div>,
      rightContent: <div>Right content</div>
    }

    return (
      <Table
        oldTable={false}
        columnKey="id"
        columns={columns}
        dataSource={this.getData(pagination, sort)}
        loading={loading}
        pagination={pagination}
        rowKey="id"
        sort={sort}
        structure={{
          paginationPosition: {
            top: true,
            bottom: true
          }
        }}
        onChangePagination={this.handleChangePagination}
        onChangeSort={this.handleChangeSort}
        topSection={topSection}
      />
    );
  }

}


SearchDetails.propTypes = {
};

export default connect(

)(SearchDetails);
