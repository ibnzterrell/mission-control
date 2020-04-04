import React, { useState } from 'react';
import { Grid, Box, Button, Collapsible, Heading, Grommet, Layer, ResponsiveContext, DropButton, Select } from 'grommet';
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
    elevation='medium'
    style={{ zIndex: '1' }}
    {...props}
  />
);
const Card = (props) => (
  <Box
    flex
    elevation='large'
    gap="small"
    pad="small"
    {...props}
  >
  </Box>
)
const SelectProviderCard = (props) => (
  <Card
    {...props} >
    <Select
      options={['Select a Cloud Provider', 'Google Cloud Platform', 'Microsoft Azure', 'Amazon Web Services']}
      value={props.provider}
      onChange={({ option }) => props.setProvider(option)}
    />
  </Card >
)
const DatabaseCard = (props) => (
  <Box>

  </Box>
);

function App() {
  // Default Configuration
  const defaultProvider = 'Select a Cloud Provider';
  const defaultFunctions = [];
  const defaultDatabases = [];

  // Configuration State
  const initProvider = JSON.parse(window.localStorage.getItem('provider')) || defaultProvider;
  const initFunction = JSON.parse(window.localStorage.getItem('functions')) || defaultFunctions;
  const initDatabases = JSON.parse(window.localStorage.getItem('databases')) || defaultDatabases;

  const [provider, setProvider] = useState(initProvider);
  const [functions, setFunctions] = useState(initFunction);
  const [databases, setDatabases] = useState(initDatabases);

  // App State
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <Grommet theme={theme} full themeMode="light">
      <ResponsiveContext.Consumer>
        {size => (
          <Box fill>
            <AppBar>
              <Heading level='3' margin='none'><Satellite /> Mission Control</Heading>
              <Button icon={<Notification />} onClick={() => { setShowSidebar(!showSidebar) }} />
            </AppBar>

            <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
              <Box flex align='center' justify='center'>
                <SelectProviderCard
                  provider={provider}
                  setProvider={setProvider}
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
          </Box>
        )}
      </ResponsiveContext.Consumer>


    </Grommet >
  );
}

export default App;
