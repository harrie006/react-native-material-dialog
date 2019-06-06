import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, ListView, Platform, TextInput, ScrollView } from 'react-native';
import { material } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialDialog from './MaterialDialog';

import colors from './colors';

export default class InputBoxMaterialDialog extends Component {
  constructor(props) {
    super(props);

    const { items, selectedItem } = props;

    const rows = items.map(item => Object.assign({}, item, { selected: false }));

    let selectedIndex;
    if (selectedItem != null) {
      selectedIndex = rows.findIndex(item => item.value === selectedItem.value);

      rows[selectedIndex] = Object.assign({}, rows[selectedIndex], {
        selected: true,
      });
    }

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.value !== r2.value || r1.selected !== r2.selected,
    }).cloneWithRows(rows);

    this.state = { dataSource, rows, selectedIndex, other_reason:'' };
  }

  // TODO: Extract common logic with the constructor
  // Refreshing the dataSource when we refresh any prop (such as visible)
  componentWillReceiveProps(nextProps) {
    const { items, selectedItem } = nextProps;

    const rows = items.map(item => Object.assign({}, item, { selected: false }));

    let selectedIndex;
    if (selectedItem != null) {
      selectedIndex = rows.findIndex(item => item.value === selectedItem.value);

      rows[selectedIndex] = Object.assign({}, rows[selectedIndex], {
        selected: true,
      });
    }

    const dataSource = this.state.dataSource.cloneWithRows(rows);

    this.setState({ dataSource, rows, selectedIndex });
  }

  onRowPress(rowID) {
    const rows = [...this.state.rows];
    const { selectedIndex } = this.state;

    if (selectedIndex != null) {
      rows[selectedIndex] = Object.assign({}, rows[selectedIndex], {
        selected: false,
      });
    }
    rows[rowID] = Object.assign({}, rows[rowID], { selected: true });

    const dataSource = this.state.dataSource.cloneWithRows(rows);

    this.setState({ dataSource, rows, selectedIndex: rowID });
  }

  renderRow = (row, sectionID, rowID) => (
    <TouchableOpacity key={row.value} onPress={() => this.onRowPress(rowID)}>
      <View style={styles.rowContainer}>
        <View style={styles.iconContainer}>
          <Icon
            name={row.selected ? 'radio-button-checked' : 'radio-button-unchecked'}
            color={this.props.colorAccent}
            size={24}
          />
        </View>
        <Text style={material.subheading}>{row.label}</Text>
      </View>
    </TouchableOpacity>
  );

  onChangeText(text){
        var value = text;
        if (value === "" || !value.replace(/\s/g, '').length) {
          this.setState({ other_reason: value })
        } 
        else {
          this.setState({ other_reason: value })
        }
        
  }

  render() {
    return (
      <MaterialDialog                           
        title={this.props.title}        
        titleColor={this.props.titleColor}
        colorAccent={this.props.colorAccent}
        visible={this.props.visible}
        okLabel={this.props.okLabel}
        scrolled={this.props.scrolled}
        onOk={() =>          
          this.props.onOk({            
            selectedItem: this.state.rows[this.state.selectedIndex],
            inputTxt: this.state.other_reason
          })}
        cancelLabel={this.props.cancelLabel}
        onCancel={() => {
          this.props.onCancel();
        }}
      >      
        <ScrollView>        
          <ListView dataSource={this.state.dataSource} renderRow={this.renderRow} />
          { this.state.selectedIndex==5 ?
            <View style={{width:'90%'}}>
            <ScrollView>          
              <TextInput
                  maxLength={500}              
                  multiline={false}
                  numberOfLines={1}
                  placeholder='type here'
                  underlineColorAndroid='transparent'
                  style={{borderWidth: 0.5, borderColor: '#A6A6A6', borderRadius: 5}}
                  onChangeText={(text) => this.onChangeText(text)}
                  //onChangeText={(text) => this.setState({text})}            
                  //value={this.state.other_reason}
                  />
              <View style={{height:30}}/>
            </ScrollView>          
            </View>                     
            : null 
          }                         
        </ScrollView>    
      </MaterialDialog>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {    
    height: 35,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
});

InputBoxMaterialDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedItem: PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,    
  }),
  title: PropTypes.string,
  titleColor: PropTypes.string,
  colorAccent: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  cancelLabel: PropTypes.string,
  okLabel: PropTypes.string,
  scrolled: PropTypes.bool,
  inputTxt: PropTypes.string,
};

InputBoxMaterialDialog.defaultProps = {
  selectedItem: undefined,
  title: undefined,
  titleColor: undefined,
  colorAccent: colors.androidColorAccent,
  cancelLabel: undefined,
  okLabel: undefined,
  scrolled: false,
};
