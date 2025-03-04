import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { RoleCheck } from 'utils/protector';

import bucketButton from 'ui/images/bucket.png';
import pencil from 'ui/images/pencil.png';
import defaultThemeObject from 'ui/styles/theme/material/defaultThemeObject';

import { TableCell, TableRow, Collapse, Checkbox } from '@material-ui/core';

const {
  breakpoints: {
    values: { md: tabletBreakpoint }
  }
} = defaultThemeObject;

class EnhancedTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tablet: false, show: false };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    if (window.innerWidth <= tabletBreakpoint && !this.state.tablet) {
      this.setState({ tablet: true });
    }
    if (window.innerWidth > tabletBreakpoint && this.state.tablet) {
      this.setState({ tablet: false });
    }
  }

  deleteModal = (e) => {
    e.stopPropagation();

    const { changeObjectParameters, extra, handleDeleteModal } = this.props;

    handleDeleteModal();
    changeObjectParameters(extra);
  };

  clickCheckBoxExtraHours = async (e) => {
    e.stopPropagation();
    this.props.handleIsProceesedChange(this.props.index);
  };

  changeModal = () => {
    const { changeObjectParameters, extra, handleModal } = this.props;

    handleModal();
    changeObjectParameters(extra);
  };

  handl = (e) => {
    this.setState({ show: !this.state.show });
    e.stopPropagation();
  };

  render() {
    const { extra } = this.props;
    const { label: name } = extra.author;
    const { tablet, show } = this.state;

    const hoursDiff = moment(extra.end).diff(extra.start, 'h');
    const minutesDiff = moment(extra.end).subtract(hoursDiff, 'h').diff(extra.start, 'm');
    const extraTime = `${hoursDiff}ч ${minutesDiff}м`;

    return (
      <>
        {!tablet && (
          <StyledTr hover tabIndex={-1} onClick={this.changeModal}>
            <RoleCheck forRole="admin">
              <SizeLimitTd align="left">{extra.author.label}</SizeLimitTd>
            </RoleCheck>
            <SizeLimitTd align="left">{moment(extra.date).format('DD.MM.YYYY')}</SizeLimitTd>
            <SizeLimitTd align="left">{extraTime}</SizeLimitTd>
            <SizeLimitTd align="left">{extra.description}</SizeLimitTd>
            <RoleCheck forRole="admin">
              <SizeLimitTd
                align="right"
                onClick={this.clickCheckBoxExtraHours}
                className="isProcessedTd"
              >
                <StyledCheckbox checked={extra.isProcessed} />
              </SizeLimitTd>
            </RoleCheck>
            <SizeLimitTd align="right" onClick={this.deleteModal}>
              <img src={bucketButton} alt="bucket" />
            </SizeLimitTd>
          </StyledTr>
        )}

        {tablet && (
          <StyledTr hover tabIndex={-1}>
            <ExtraTd align="left">
              <div className="extra-content">
                <div className="date">{`${name.trim()}, ${moment(extra.date).format('DD.MM.YYYY')}`}</div>
                <Collapse in={show} className="collapse" >
                  <div className="collapse-item">
                    {extraTime}
                  </div>
                  <div className="collapse-item">
                    {extra.description},
                    </div>
                  <div className="collapse-item controls">
                    <RoleCheck forRole='admin' >
                      <StyledCheckbox
                        checked={extra.isProcessed}
                        onClick={this.clickCheckBoxExtraHours}
                      />
                    </RoleCheck>
                    <img className="controls-item" src={pencil} alt="pencil" onClick={this.changeModal} />
                    <img className="controls-item" src={bucketButton} alt="bucket" onClick={this.deleteModal} />
                  </div>
                </Collapse>
              </div>
              <CollapseButton align="left" onClick={this.handl} show={show} />
            </ExtraTd>
          </StyledTr>
        )}
      </>
    );
  }
}

const StyledTr = styled(TableRow)`
  && {
    cursor: pointer;
    background-color: #fff;
    height: 70px;
    border: 1px solid #efefef;
  }

  .controls {
    display: flex;
    align-items: center;
  }
  .controls-item {
    margin-right: 15px;
  }
  td:last-of-type {
    padding: 20px 35px;
    width: 10px;
    font-size: 18px;
  }

  .collapse-item {
    padding-top: 15px;
    word-break: break-all;
  }
  @media (max-width: ${tabletBreakpoint}px) {
    && td:last-of-type {
      padding-left: 22px;
      width: 100%;
    }
  }
`;

const ExtraTd = styled(TableCell)`
  && {
    display: flex;
    justify-content: space-between;
    border: 0;
    max-width: unset;
    position: relative;
  }
`;

const SizeLimitTd = styled(TableCell)`
  max-width: 10px;
  word-wrap: break-word;

  && {
    padding: 22px 0;
    padding-left: 23px;
    font-size: 16px;
    line-height: 22px;
  }

  a {
    color: black;
  }
  &.isProcessedTd {
    text-align: center;
  }
`;
const StyledCheckbox = styled(Checkbox)`
  span {
    color: ${(props) => props.checked && 'black!important'};
  }
`;
const CollapseButton = styled.div`
  &&::after {
    content: '一';
    color: #b163ff;
    transform: ${(props) => (props.show ? 'rotate(180deg)' : 'rotate(90deg)')};
    transition: 0.2s;
    position: absolute;
  }
  &&::before {
    content: '一';
    color: #b163ff;
    position: absolute;
  }
`;

EnhancedTableRow.propTypes = {
  emptyRows: PropTypes.number,
  rows: PropTypes.arrayOf(PropTypes.object),
  handleModal: PropTypes.func,
  extra: PropTypes.object.isRequired,
  handleDeleteModal: PropTypes.func,
  modalDelete: PropTypes.bool,
  index: PropTypes.number,
  changeObjectParameters: PropTypes.func,
  handleIsProceesedChange: PropTypes.func
};

EnhancedTableRow.defaultProps = {
  emptyRows: 0,
  rows: [],
  modalDelete: false,
  changeObjectParameters: () => null,
  handleDeleteModal: () => null,
  handleModal: () => null,
  submitIsProcessed: () => null
};

export default EnhancedTableRow;
