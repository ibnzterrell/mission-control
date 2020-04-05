import React, { useState } from 'react';
import { Text, Select, TextInput, Main, Box, Button, Heading, Grommet, ResponsiveContext, Form, FormField, RadioButtonGroup } from 'grommet';
import { Validate, Tools, Inspect, Threats, Clipboard, Scorecard, Deploy, Trash, DocumentUpload, CloudDownload, Launch } from 'grommet-icons';
import { generateTerraform } from './generate.js';

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
    border={true}
    width='large'
    elevation='medium'
    pad='medium'
    margin='small'
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

const FunctionCard = (props) => (
  <Card
    title='Function'
    {...props}
  >
    <Text>{props.name}</Text>
    <Text>{props.language}</Text>
  </Card>
)
const DatabaseTableCard = (props) => (
  <Card
    title='Database Table'
    {...props}
  >
    <Text>{props.name}</Text>
  </Card>
);

const StorageBucketCard = (props) => (
  <Card
    title='Storage Bucket'
    {...props}
  >
    <Text>{props.name}</Text>
  </Card>
);
const SelectProviderCard = (props) => (
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
        <TextInput placeholder="none"
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
);

function App() {
  // Default Configuration
  const defaultProvider = 'none';
  const defaultRegion = 'none';
  const defaultProjectID = 'none';
  const defaultFunctions = [];
  const defaultDatabaseTables = [];
  const defaultStorageBuckets = [];

  // Configuration State
  const initProvider = JSON.parse(window.localStorage.getItem('provider')) || defaultProvider;
  const initRegion = JSON.parse(window.localStorage.getItem('region')) || defaultRegion;
  const initProjectID = JSON.parse(window.localStorage.getItem('projectID')) || defaultProjectID;
  const initFunctions = JSON.parse(window.localStorage.getItem('functions')) || defaultFunctions;
  const initDatabaseTables = JSON.parse(window.localStorage.getItem('databaseTables')) || defaultDatabaseTables;
  const initStorageBuckets = JSON.parse(window.localStorage.getItem('storageBuckets')) || defaultStorageBuckets;

  const [provider, setProvider] = useState(initProvider);
  const [region, setRegion] = useState(initRegion);
  const [projectID, setProjectID] = useState(initProjectID);
  const [functions, setFunctions] = useState(initFunctions);
  const [databaseTables, setDatabaseTables] = useState(initDatabaseTables);
  const [storageBuckets, setStorageBuckets] = useState(initStorageBuckets);


  function clearState() {
    setProvider(defaultProvider);
    setRegion(defaultRegion);
    setProjectID(defaultProjectID);
    setFunctions(defaultFunctions);
    setDatabaseTables(defaultDatabaseTables);
    setStorageBuckets(defaultStorageBuckets);
  }
  function importStateJSON(str) {
    console.log(str);
    const newState = JSON.parse(str);
    setProvider(newState.provider);
    setRegion(newState.region);
    setProjectID(newState.projectID);
    setFunctions(newState.functions);
    setDatabaseTables(newState.databaseTables);
    setStorageBuckets(newState.storageBuckets);
  }

  const fileElement = document.getElementById('fileElement');
  const fileReader = new FileReader();

  function fileLoaded() {
    console.log('File Uploaded!');
    importStateJSON(fileReader.result);
  }
  function fileHandler() {
    if (this.files.length) {
      fileReader.onloadend = fileLoaded;
      fileReader.readAsText(this.files[0]);
    }
  }

  fileElement.addEventListener('change', fileHandler, false);

  function importStateLocal() {
    fileElement.click();
  }
  function importCloudState() {

  }
  function generateFromState() {
    let state = {
      provider,
      region,
      projectID,
      functions,
      databaseTables,
      storageBuckets
    };
    const tfConfig = generateTerraform(state);
    const blob = new Blob([tfConfig], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `main.tf`;
    link.href = url;
    link.click();
  }
  function verifyState() {
    fetch('http://localhost:2004/plan');
  }
  function deployState() {
    fetch('http://localhost:2004/apply');
  }

  function destroyState() {
    fetch('http://localhost:2004/destroy');
  }
  return (
    <Grommet full themeMode="light">
      <ResponsiveContext.Consumer>
        {size => (
          <Main>
            <AppBar>
              <Heading level='2' margin='none'><Launch /> Launchpad</Heading>
              <Box direction='row'>
                <Button icon={<Trash />} onClick={() => { clearState() }} />
                <Button icon={<DocumentUpload />} onClick={() => { importStateLocal() }} />
                <Button icon={<CloudDownload />} onClick={() => { importCloudState() }} />
                <Button icon={<Scorecard />} onClick={() => { generateFromState() }} />
                <Button icon={<Validate />} onClick={() => { verifyState() }} />
                <Button icon={<Deploy />} onClick={() => { deployState() }} />
                <Button icon={<Threats />} onClick={() => { destroyState() }} />
              </Box>
            </AppBar>

            <Box direction='row' fill={true}>
              <Box flex align='center' overflow='scroll'>
                <Box flex={false}>
                  <SelectProviderCard
                    provider={provider}
                    setProvider={setProvider}
                    projectID={projectID}
                    setProjectID={setProjectID}
                    region={region}
                    setRegion={setRegion}
                  />
                  {functions.map(
                    func => (
                      <FunctionCard key={func.name} name={func.name} language={func.language} />
                    )
                  )}
                  {databaseTables.map(
                    table => (
                      <DatabaseTableCard key={table.name} name={table.name} />
                    )
                  )}
                  {storageBuckets.map(
                    bucket => (
                      <StorageBucketCard key={bucket.name} name={bucket.name} />
                    )
                  )}
                </Box>
              </Box>
            </Box>
          </Main>
        )}
      </ResponsiveContext.Consumer>


    </Grommet >
  );
}

export default App;
