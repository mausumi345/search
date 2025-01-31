//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers main view
//
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    StackingLayout, ElementPlusLabel, NavBarLayout, MagGlassIcon,ThemeManager, Link,AlertIcon, Badge,
    FlexLayout, Input, FileInput, FormLayout, Select, Button, TextLabel, InputPlusLabel, FlexItem
} from 'prism-reactjs';
import i18n from '../utils/i18n';


// Actions
import {
    openModal,
    fetchFsData
} from '../actions';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
    'FileServerSettings', key, defaultValue, replacedValue);
const DURATION = 30000;

class FileServerSettings extends React.Component {

    static propTypes = {
        fsNames: PropTypes.array,
        fileNames: PropTypes.array,
        sharePath: PropTypes.string,
        dockerScript: PropTypes.string,
        appName: PropTypes.string,
        defaultArg: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            fsNames: props.fsNames || [],
            fileNames: props.fileNames || [],
            sharePath: props.sharePath || '',
            dockerScript: props.dockerScript || '',
            appName: props.appName || '',
            defaultArg: props.defaultArg || ''
        };
    }

    render() {
        var dataArray = [];
        if (this.props.fsData) {
            let fsName = [];
            for (var i = 0; i < Number(this.props.fsData.total_entity_count); i++) {
                fsName.push(this.props.fsData.group_results[0].entity_results[i].data[0].values[0].values);
            }
            for (var i = 0; i < fsName.length; i++) {
                var data = {
                    value: fsName[i][0],
                    title: fsName[i][0],
                    key: i
                };
                dataArray.push(data);
            }
        }
  
        const header = (
            <StackingLayout>
                <NavBarLayout
                    prefix={<MagGlassIcon color={ThemeManager.getVar('gray-2')}/>}/>
            </StackingLayout>
        );
        
        const body = (
            <StackingLayout>    
                <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>Script Upload</TextLabel> &nbsp; &nbsp;
                <input type="file"  id="fileNames" name="fileNames" onChange={this.onUpload}/>
                <ElementPlusLabel
                    label="File Server"
                    element={
                        <Select label="Select Option" placeholder="Select File Server"
                            selectOptions={dataArray}
                            onChange={this.handleFsNameChange}
                            multiple={true}
                        />
                    }
                />
                <InputPlusLabel label="Docker Script" id="dockerScript"  onChange={this.handleInputChange} />
                <InputPlusLabel label="Share Path" id="sharePath" placeholder="e.g. /dir1/" onChange={this.handleInputChange} />
                <InputPlusLabel label="Default Arguments" id="defaultArg"  onChange={this.handleInputChange} />
                <InputPlusLabel label="Name Of the App" id="appName"  onChange={this.handleInputChange} />
            </StackingLayout>
        );

        const footer = (
            <FlexLayout itemSpacing="10px" justifyContent="flex-end">
                <Button onClick={this.handleClickSubmit}>Run</Button>
            </FlexLayout>
        );
  
        if (this.props.fsData) {
            return (<div>

                <FormLayout
                    contentWidth="600px"
                    header={header}
                    body={body}
                    footer={footer} />

            </div>);
        } else {
            return (<div></div>);
        }

        // Render Search Details Modal with paginated table

        
    }

    // Start Polling FS data
    componentWillMount() {
        this.props.fetchFsData();
        this.dataPolling = setInterval(
            () => {
                this.props.fetchFsData();
            }, DURATION);
    }

    // Stop Polling FS data
    componentWillUnmount() {
        clearInterval(this.dataPolling);
    }

    handleOnChange = (e) => {
        alert(`${e.target.value}`);


        this.setState({
            searchType: `${e.target.value}`,
        });
        console.log(this.state);
    }

    onUpload = (event) => {
      this.setState({
        fileNames: event.target.files[0],
      });
    }
    /**
   * Handler for when there is a change to Input component
   * @param {object} e - SyntheticEvent
   */
    handleInputChange = (e) => {
        const attr = e.currentTarget.id;
        const hash = {};
        hash[attr] = e.currentTarget.value;
        this.setState(hash);
        console.log(this.state)
    };

    /**
 * Handler for when there is a change to directory service
 * @param {string} value - New directory service value
 */
    handleFsNameChange = (value) => {
        this.setState({
            fsNames: value,
        });
    };

    handleClickSubmit = () => {
        console.log('handle submit' + this.state.fsNames)
        console.log('handle submit' + this.state.searchKeyword)
        console.log('handle submit' + this.state.searchType)
        console.log('handle submit' + this.state.sharePath)
        this.settingsAPI(this.state);
    }
        
    settingsAPI(data) {
    // Groups Query to get all categories by name
    const query = {
      fsNames: data.fsNames,
      search_keyword: data.searchKeyword,
      share_path: data.sharepath,
      search_type: data.searchType
    };
    const configAxios = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
    return axios.post("http://10.51.148.126:8800/files_app/search", configAxios)
      .then((resp) => {
        if (resp.data) {
        this.state.visible = true;
        }

      })
      .catch((err) => {
        // TODO: error details
      });
      // this.renderSearchDetailsModal();
    }
    
    renderSearchDetailsModal = () => {
        alert('search details')


    }
}
const mapStateToProps = state => {
  return {
      fsData: state.groupsapi.fsData
  };
};

const mapDispatchToProps = dispatch => {
  return {
      openModal: (type, options) => dispatch(openModal(type, options)),
      fetchFsData: () => dispatch(fetchFsData())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileServerSettings);
