//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers details popup
//
import React from 'react';
import { Modal, Table, StackingLayout } from 'prism-reactjs';
import PropTypes from 'prop-types';
import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServersDetails', key, defaultValue, replacedValue);

class FileServersDetails extends React.Component {

  render() {
    const {
      name,
      afs_version : version,
      nvm_uuid_list : vms
    } = this.props.details;

    const columns = [{
      title: '',
      key: 'title'
    }, {
      title: '',
      key: 'data'
    }];

    const data = [{
      key: '1',
      title: i18nT('fs_name', 'File Server Name'),
      data: name
    }, {
      key: '2',
      title: i18nT('verion', 'Version'),
      data: version.split('-')[0]
    }, {
      key: '3',
      title: i18nT('fs_vms', 'File Server VMs'),
      data: vms.split(',').length || 0
    }, {
      key: '4',
      title: i18nT('external_ip_addresses', 'External IP Addresses'),
      data: 'na'
    }];

    return (
      <div>
        <Modal
          visible={ this.props.visible }
          title={ i18nT('file_server_details', 'File Server Details') }
          primaryButtonLabel="Done"
          primaryButtonClick={ this.props.onClose }
          onCancel={ this.props.onClose }
        >
          <StackingLayout padding="20px">
            <Table structure={ { hideHeader:true } } oldTable={ false } dataSource={ data }
              columns={ columns } />
          </StackingLayout>
        </Modal>
      </div>
    );
  }
}

FileServersDetails.propTypes = {
  options: PropTypes.object,
  details: PropTypes.object,
  getChildSate: PropTypes.func,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  afs_version: PropTypes.string,
  nvm_uuid_list: PropTypes.string
};

export default FileServersDetails;
