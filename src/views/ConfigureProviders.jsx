import React from 'react';

import Input from '../components/Input';

const ConfigureProviders = () => (
  <main className="container-fluid overflow-auto">
    <h1 className="text-center">Configure Providers</h1>
    <div className="lead">Create and modify providers.</div>
    <div className="row">
      <div className="col">
        <section>
          <h2>Heading 2</h2>
          <form>
            <fieldset>
              <legend>Choose</legend>
              Create new provider or edit existing provider toggle here.
            </fieldset>
            <fieldset>
              <legend>Name</legend>
              <div className="form-row">
                <div className="col">
                  <Input type="text" name="lastName" value="" label="Last" />
                </div>
                <div className="col">
                  <Input type="text" name="firstName" value="" label="First" />
                </div>
                <div className="col">
                  <Input type="text" name="mi" value="" label="MI" />
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  <Input type="text" name="adcId" value="" label="ADC ID" />
                </div>
                <div className="col">
                  <Input type="text" name="emarId" value="" label="EMAR ID" />
                </div>
              </div>
            </fieldset>
          </form>
        </section>
      </div>
      <div className="col">
        <section>
          <h2>Heading 2</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">ADC ID</th>
                <th scope="col">EMAR ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td span="3">
                  Programmaticly generate rows based on existing users and
                  unassigned IDs
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </main>
);

export default ConfigureProviders;
