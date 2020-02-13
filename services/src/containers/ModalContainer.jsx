//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Container for modal
//

// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeModal } from '../actions';
import FileServersDetails from '../popups/FileServersDetails.jsx';

// Constants
import { MODAL_TYPE } from '../utils/AppConstants';

/**
 * Class represents Header Container
 * @class
 * @extends HulkComponent
*/
class ModalContainer extends React.Component {

  static propTypes = {
    /**
     * Any options related to the target modal component
     */
    options: PropTypes.object,
    /**
     * value that indicates wheter or not the modal is visible
     */
    visible: PropTypes.bool
    /**
     * modal type that will be shown
     */
  }

  render() {
    const {
      options = {},
      visible,
      type
    } = this.props.modals;
    const {
      closeModal: close
    } = this.props;

    if (type === MODAL_TYPE.FILE_SERVER_DETAILS) {
      const { entity: details } = options;
      return (
        <FileServersDetails
          closeModalAction={ close }
          visible={ visible }
          onClose={ options.onClose || close }
          details={ details }
        />
      );
    }

    return null;
  }
}

const mapStateToProps = state => {
  return {
    modals: state.modals
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeModal: () => dispatch(closeModal())
  };
};

ModalContainer.propTypes = {
  options: PropTypes.object,
  visible: PropTypes.bool,
  type: PropTypes.string,
  modals: PropTypes.object,
  closeModal: PropTypes.func
};


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalContainer);
