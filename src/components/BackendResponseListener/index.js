import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

import {
  receiveDatabaseStatus,
  receiveError,
  receiveTableRecords,
  receiveFormData,
} from '../../redux/actions';
import { createRequest, sendBackendRequest } from '../../util';

let _store;

BackendResponseListener.propTypes = {
  store: PropTypes.object,
};

export default function BackendResponseListener({ store }) {
  _store = store;
  useEffect(listenForBackendResponse, []);
  return null;
}

function listenForBackendResponse() {
  ipcRenderer.on('backend-response', handleBackendResponse);
  return stopListeningForBackendResponse;
}

function handleBackendResponse(event, response) {
  if (response.head.status === 'ERROR') {
    handleError(response.body.error);
  } else {
    routeResponse(response);
  }
}

function handleError(error) {
  _store.dispatch(receiveError(error));
  alert();
}

function routeResponse(response) {
  switch (response.head.type) {
    case 'database-status':
      _store.dispatch(receiveDatabaseStatus(response.body));
      break;
    case 'form-data':
      _store.dispatch(receiveFormData(response.body.form, response.body.data));
      break;
    case 'post':
      handlePostResponse(response);
      break;
    case 'put':
      handlePutResponse(response);
      break;
    case 'table-records':
      _store.dispatch(receiveTableRecords(response.body.table, response.body.records));
      break;
    default:
      throw new Error(
        `BackendResponseListener received unhandled resource type: ${response.head.type}.`,
      );
  }
}

function handlePostResponse(response) {
  switch (response.body.resource) {
    case 'data':
      alert('Data imported successfully!');
    default:
      throw new Error(
        `BackendResponseListener received post response to unhandled resource: ${response.body.resource}.`,
      );
  }
}

function handlePutResponse(response) {
  switch (response.body.resource) {
    case 'provider': {
      const { providerId } = _store.getState().forms.editProvider.data;
      const getEditProviderRequest = createRequest('GET', 'edit-provider', providerId);
      sendBackendRequest(getEditProviderRequest);
      const providersFields = _store.getState().forms.providers.fields;
      const getProvidersRequest = createRequest('GET', 'providers', { ...providersFields });
      sendBackendRequest(getProvidersRequest);
      break;
    }
    default:
      throw new Error(
        `BackendResponseListener received put response to unhandled resource: ${response.body.resource}.`,
      );
  }
}

function stopListeningForBackendResponse() {
  ipcRenderer.removeAllListeners('backend-response');
}
