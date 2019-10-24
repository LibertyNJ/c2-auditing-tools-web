import { ipcRenderer } from 'electron';

export function sendBackendRequest(request) {
  ipcRenderer.send('backend-request', request);
}
