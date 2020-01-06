/**
 * ListPopover - Popover rendered with a selectable list.
 */
"use strict";

import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View
} from 'react-native';
const noop = () => {};

class ListPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.list
    };
  }

  listMaxHeightHandler = dims => this.setListMaxHeight();

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      this.setState({dataSource: nextProps.list});
    }
  }

  UNSAFE_componentWillMount() {
    this.setListMaxHeight();
    Dimensions.addEventListener("change", this.listMaxHeightHandler);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.listMaxHeightHandler);
  }

  setListMaxHeight() {
    const maxHeightFraction = this.props.maxHeightFraction || 3/4;
    this.setState({listMaxHeight: Dimensions.get('window').height * maxHeightFraction});
  }

  handleClick(data) {
    this.props.onClick(data);
    this.props.onClose();
  }

  renderRow(rowText) {
    const separatorStyle = this.props.separatorStyle || DefaultStyles.separator;
    const rowTextStyle = this.props.rowText || DefaultStyles.rowText;

    let separator = <View style={separatorStyle}/>;
    if (rowText === this.props.list[0]) {
      separator = null;
    }

    let row = <Text style={rowTextStyle}>{rowText}</Text>
    if (this.props.renderRow) {
      row = this.props.renderRow(rowText);
    }

    return (
      <View>
        {separator}
        <TouchableOpacity onPress={() => this.handleClick(rowText)}>
          {row}
        </TouchableOpacity>
      </View>
    );
  }

  renderList() {
    const scrollBounce = this.props.scrollBounce === undefined ? true : this.props.scrollBounce;

    return (
      <FlatList
        style={{maxHeight: this.state.listMaxHeight}}
        data={this.state.dataSource}
        renderItem={({ item }) => this.renderRow(item.title)}
        keyExtractor={item => item.id}
        bounces={scrollBounce}
      />
    );
  }

  render() {
    const containerStyle = this.props.containerStyle || DefaultStyles.container;
    const popoverStyle = this.props.popoverStyle || DefaultStyles.popover;

    if (this.props.isVisible) {
      return (
        <TouchableOpacity onPress={this.props.onClose} style={containerStyle}>
          <View style={popoverStyle}>
            {this.renderList()}
          </View>
        </TouchableOpacity>
      );
    } else {
      return (<View/>);
    }
  }
}

ListPopover.propTypes = {
  list: PropTypes.array.isRequired,
  isVisible: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

ListPopover.defaultProps = {
  list: [""],
  isVisible: false,
  onClick: noop,
  onClose: noop
};

const DefaultStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
  popover: {
    backgroundColor: '#fff',
    borderRadius: 3,
    padding: 3,
    width: '96%',
  },
  rowText: {
    padding: 10,
  },
  separator: {
    backgroundColor: '#ccc',
    height: 0.5,
    marginLeft: 8,
    marginRight: 8,
  },
});

export default ListPopover;
