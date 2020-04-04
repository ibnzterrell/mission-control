import React, { useState } from 'react';
import { Select, TextInput, Main, Box, Button, Collapsible, Heading, Grommet, Layer, ResponsiveContext, Form, FormField, RadioButtonGroup } from 'grommet';
import { Google, Windows, Amazon, Satellite, FormClose, Notification } from 'grommet-icons';

const theme = {
  /*
  global: {
    colors: {
      brand: '#228BE6',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
  */
};

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='low'
    style={{ zIndex: '1' }}
    {...props}
  />
);
const Card = (props) => (
  <Box
    width='large'
    flex='shrink'
    elevation='medium'
    gap='small'
    pad='small'
    {...props}
  >
    <Heading
      level='3'
      margin='small'
    >
      {props.title}
    </Heading>
    {props.children}
  </Box >
)
const ProviderCard = (props) => (
  <Card
    title='Cloud Provider'
    {...props} >
    <Form>
      <FormField label='Select a Provider'>
        <RadioButtonGroup
          name='ProviderGroup'
          options={['Google Cloud Platform', 'Microsoft Azure', 'Amazon Web Services']}
          value={props.provider}
          onChange={(event) => props.setProvider(event.target.value)}
        />
      </FormField>
      <FormField label='Project ID'>
        <TextInput placeholder="type here"
          value={props.projectID}
          onChange={(event) => props.setProjectID(event.target.value)}
        />
      </FormField>
      <FormField label='Region'>
        <Select
          name='RegionGroup'
          options={['us-east1', 'us-east2', 'us-central1', 'us-west1', 'us-west2', 'us-west3']}
          value={props.region}
          onChange={({ option }) => props.setRegion(option)}
        />
      </FormField>
    </Form>
  </Card >
)
const DatabaseCard = (props) => (
  <Box>

  </Box>
);

function App() {
  // Default Configuration
  const defaultProvider = 'none';
  const defaultRegion = 'none';
  const defaultProjectID = 'none';
  const defaultFunctions = [];
  const defaultDatabases = [];

  // Configuration State
  const initProvider = JSON.parse(window.localStorage.getItem('provider')) || defaultProvider;
  const initRegion = JSON.parse(window.localStorage.getItem('region')) || defaultRegion;
  const initProjectID = JSON.parse(window.localStorage.getItem('projectID')) || defaultProjectID;
  const initFunction = JSON.parse(window.localStorage.getItem('functions')) || defaultFunctions;
  const initDatabases = JSON.parse(window.localStorage.getItem('databases')) || defaultDatabases;

  const [provider, setProvider] = useState(initProvider);
  const [region, setRegion] = useState(initRegion);
  const [projectID, setProjectID] = useState(initProjectID);
  const [functions, setFunctions] = useState(initFunction);
  const [databases, setDatabases] = useState(initDatabases);

  // App State
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <Grommet theme={theme} full themeMode="light">
      <ResponsiveContext.Consumer>
        {size => (
          <Main>
            <AppBar>
              <Heading level='2' margin='none'><Satellite /> Mission Control</Heading>
              <Button icon={<Notification />} onClick={() => { setShowSidebar(!showSidebar) }} />
            </AppBar>

            <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
              <Box flex align='center' justify='center'>
                <ProviderCard
                  provider={provider}
                  setProvider={setProvider}
                  projectID={projectID}
                  setProjectID={setProjectID}
                  region={region}
                  setRegion={setRegion}

                />
              </Box>

              {(!showSidebar || size !== 'small') ? (
                <Collapsible direction="horizontal" open={showSidebar}>
                  <Box
                    flex
                    width='medium'
                    background='light-2'
                    elevation='small'
                    align='center'
                    justify='center'
                  >
                    Sidebar
                  </Box>
                </Collapsible>
              ) : (
                  <Layer>
                    <Box
                      background='light-2'
                      tag='header'
                      justify='end'
                      align='center'
                      direction='row'
                    >
                      <Button
                        icon={<FormClose />}
                        onClick={() => setShowSidebar(false)}
                      />
                    </Box>
                    <Box
                      fill
                      background='light-2'
                      align='center'
                      justify='center'
                    >
                    </Box>
                  </Layer>
                )}
            </Box>
          </Main>
        )}
      </ResponsiveContext.Consumer>


    </Grommet >
  );
}

export default App;
