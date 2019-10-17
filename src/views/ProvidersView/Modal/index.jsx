import React from 'react';

import Form from './Form';
import FooterContent from './FooterContent';
import Modal from '../../../components/Modal';
import ProviderName from './ProviderName';

const ProviderModal = React.forwardRef((props, ref) => (
  <Modal footerContent={FooterContent()} heading="Edit provider" level={3} ref={ref}>
    <ProviderName />
    <Form />
  </Modal>
));

export default ProviderModal;
