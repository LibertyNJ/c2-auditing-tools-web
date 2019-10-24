import React from 'react';

import FooterContent from './FooterContent';
import Form from './Form';
import ConnectedProviderNameDisplay from '../../../redux/containers/ConnectedProviderNameDisplay';
import Modal from '../../../components/Modal';

export default function ProviderModal({ ...restProps }) {
  return (
    <Modal footerContent={<FooterContent />} heading="Edit provider" {...restProps}>
      <ConnectedProviderNameDisplay />
      <Form />
    </Modal>
  );
}
