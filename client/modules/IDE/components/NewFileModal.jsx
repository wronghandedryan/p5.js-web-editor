import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { reduxForm } from 'redux-form';
import InlineSVG from 'react-inlinesvg';
import NewFileForm from './NewFileForm';
import { getCanUploadMedia, getreachedTotalSizeLimit } from '../selectors/users';
import { closeNewFileModal } from '../actions/ide';
import { createFile } from '../actions/files';

const exitUrl = require('../../../images/exit.svg');


// At some point this will probably be generalized to a generic modal
// in which you can insert different content
// but for now, let's just make this work
class NewFileModal extends React.Component {
  constructor(props) {
    super(props);
    this.focusOnModal = this.focusOnModal.bind(this);
  }

  componentDidMount() {
    this.focusOnModal();
  }

  focusOnModal() {
    this.modal.focus();
  }

  render() {
    return (
      <section className="modal" ref={(element) => { this.modal = element; }}>
        <div className="modal-content">
          <div className="modal__header">
            <h2 className="modal__title">Create File</h2>
            <button className="modal__exit-button" onClick={this.props.closeNewFileModal}>
              <InlineSVG src={exitUrl} alt="Close New File Modal" />
            </button>
          </div>
          <NewFileForm
            focusOnModal={this.focusOnModal}
            {...this.props}
          />
        </div>
      </section>
    );
  }
}

NewFileModal.propTypes = {
  createFile: PropTypes.func.isRequired,
  closeNewFileModal: PropTypes.func.isRequired
};

function validate(formProps) {
  const errors = {};

  if (!formProps.name) {
    errors.name = 'Please enter a name';
  } else if (!formProps.name.match(/(.+\.js$|.+\.css$|.+\.json$|.+\.txt$|.+\.csv$|.+\.tsv$)/i)) {
    errors.name = 'File must be of type JavaScript, CSS, JSON, TXT, CSV, or TSV.';
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    canUploadMedia: getCanUploadMedia(state),
    reachedTotalSizeLimit: getreachedTotalSizeLimit(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createFile, closeNewFileModal }, dispatch);
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'new-file',
    fields: ['name'],
    validate
  })
)(NewFileModal);
