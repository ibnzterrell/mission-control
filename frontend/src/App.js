import React, { useState } from 'react';
import { Text, Accordion, AccordionPanel, Select, TextInput, Main, Box, Button, Collapsible, Heading, Grommet, Layer, ResponsiveContext, Form, FormField, RadioButtonGroup } from 'grommet';
import { Database, Troubleshoot, Google, Windows, Amazon, Satellite, Close, Notification } from 'grommet-icons';

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
    title='Database'
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
const AccordionFormButton = (props) => (
  <Button
    margin='small'
    primary
    label={props.label}
    type='submit'
    {...props}
  />
);
const AccordionCard = (props) => (
  <AccordionPanel
    label={props.title}
    margin='small'
    {...props}
  >
    {props.children}
  </AccordionPanel>
);

const AddFunctionCard = (props) => (
  <AccordionCard
    title='Add a Serverless Function'
    {...props}
  >
    <Form>
      <FormField
        label='Function Name'
      >
        <TextInput placeholder="none"
          value={props.functionName}
          onChange={(event) => props.setFunctionName(event.target.value)}
        />
      </FormField>
      <FormField
        label='Function Language'
      >
        <RadioButtonGroup
          name='FunctionLanguageGroup'
          options={['Python 3.7', 'Node.js 8', 'Node.js 10']}
          value={props.functionLanguage}
          onChange={(event) => props.setFunctionLanguage(event.target.value)}
        />
      </FormField>
      <AccordionFormButton label="Add Function" onClick={() => props.addFunction(props.functionName, props.functionLanguage)} />
    </Form>
  </AccordionCard>
);

const AddDatabaseTableCard = (props) => (
  <AccordionCard
    title='Add a Database Table'
    {...props}
  >
    <Form>
      <FormField
        label='Table Name'
      >
        <TextInput placeholder='none'
          value={props.databaseTableName}
          onChange={(event) => props.setDatabaseTableName(event.target.value)}
        />
      </FormField>
      <AccordionFormButton label="Add Database Table" onClick={() => props.addDatabaseTable(props.databaseTableName)} />
    </Form>
  </AccordionCard>
);

const AddStorageBucketCard = (props) => (
  <AccordionCard
    title='Add a Storage Bucket'
    {...props}
  >
    <Form>
      <FormField
        label='Bucket Name'
      >
        <TextInput placeholder='none'
          value={props.storageBucketName}
          onChange={(event) => props.setStorageBucketName(event.target.value)}
        />
      </FormField>
      <AccordionFormButton label="Add Storage Bucket" onClick={() => props.addStorageBucket(props.storageBucketName)} />
    </Form>
  </AccordionCard>
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
  const initFunction = JSON.parse(window.localStorage.getItem('functions')) || defaultFunctions;
  const initDatabaseTables = JSON.parse(window.localStorage.getItem('databaseTables')) || defaultDatabaseTables;
  const initStorageBuckets = JSON.parse(window.localStorage.getItem('storageBuckets')) || defaultStorageBuckets;

  const [provider, setProvider] = useState(initProvider);
  const [region, setRegion] = useState(initRegion);
  const [projectID, setProjectID] = useState(initProjectID);
  const [functions, setFunctions] = useState(initFunction);
  const [databaseTables, setDatabaseTables] = useState(initDatabaseTables);
  const [storageBuckets, setStorageBuckets] = useState(initStorageBuckets);

  // Default App State
  const initFunctionName = 'none';
  const initFunctionLanguage = 'none';
  const initDatabaseTableName = 'none';
  const initStorageBucketName = 'none';

  // App State
  const [showSidebar, setShowSidebar] = useState(false);
  const [functionName, setFunctionName] = useState(initFunctionName);
  const [functionLanguage, setFunctionLanguage] = useState(initFunctionLanguage);
  const [databaseTableName, setDatabaseTableName] = useState(initDatabaseTableName);
  const [storageBucketName, setStorageBucketName] = useState(initStorageBucketName);

  function addFunction(name, language) {
    let functionList = functions.concat(
      {
        name,
        language
      }
    );
    setFunctions(functionList);
    setShowSidebar(false);
    setFunctionName(initFunctionName);
    setFunctionLanguage(initFunctionLanguage);
  }

  function addDatabaseTable(name) {
    let tableList = databaseTables.concat(
      {
        name
      }
    );
    setDatabaseTables(tableList);
    setShowSidebar(false);
    setDatabaseTableName(initDatabaseTableName);
  }

  function addStorageBucket(name) {
    let bucketList = storageBuckets.concat(
      {
        name
      }
    );
    setStorageBuckets(bucketList);
    setShowSidebar(false);
    setStorageBucketName(initStorageBucketName);
  }

  return (
    <Grommet theme={theme} full themeMode="light">
      <ResponsiveContext.Consumer>
        {size => (
          <Main>
            <AppBar>
              <Heading level='2' margin='none'><Satellite /> Mission Control</Heading>
              <Button icon={<Troubleshoot />} onClick={() => { setShowSidebar(!showSidebar) }} />
            </AppBar>

            <Box direction='row' fill={true}>
              <Box flex align='center' overflow='scroll'>
                <Box flex={false}>
                  <ProviderCard
                    provider={provider}
                    setProvider={setProvider}
                    projectID={projectID}
                    setProjectID={setProjectID}
                    region={region}
                    setRegion={setRegion}
                  />
                  {functions.map(
                    functionS => (
                      <FunctionCard key={functionS.name} name={functionS.name} language={functionS.language} />
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

              {(!showSidebar || size !== 'small') ? (
                <Collapsible direction="horizontal" open={showSidebar}>
                  <Box
                    flex
                    background='light-2'
                    elevation='medium'
                    align='center'
                    justify='center'
                    overflow='scroll'
                  >
                    <Heading aligjustify='center' fill='horizontal'>Toolbox</Heading>
                    <Accordion
                      animate={true}
                      multiple={true}
                      margin='small'
                      flex
                      fill='horizontal'
                    >
                      <AddFunctionCard
                        functionName={functionName}
                        setFunctionName={setFunctionName}
                        functionLanguage={functionLanguage}
                        setFunctionLanguage={setFunctionLanguage}
                        addFunction={addFunction}
                      />
                      <AddDatabaseTableCard
                        databaseTableName={databaseTableName}
                        setDatabaseTableName={setDatabaseTableName}
                        addDatabaseTable={addDatabaseTable}
                      />
                      <AddStorageBucketCard
                        storageBucketName={storageBucketName}
                        setStorageBucketName={setStorageBucketName}
                        addStorageBucket={addStorageBucket}
                      />
                    </Accordion>
                  </Box>
                </Collapsible>
              ) : (
                  <Layer animation='none'>
                    <Box
                      background='light-2'
                      tag='header'


                      direction='column'
                    >
                      <Box align='center' direction='row' justify='end'>
                        <Box align='center' justify='center' fill='horizontal'>
                          <Heading>Toolbox</Heading>
                        </Box>

                        <Button
                          icon={<Close />}
                          onClick={() => setShowSidebar(false)}
                        />
                      </Box>

                      <Accordion
                        animate={true}
                        multiple={true}
                        margin='small'
                        flex
                        fill='horizontal'
                      >
                        <AddFunctionCard
                          functionName={functionName}
                          setFunctionName={setFunctionName}
                          functionLanguage={functionLanguage}
                          setFunctionLanguage={setFunctionLanguage}
                          addFunction={addFunction}
                        />
                        <AddDatabaseTableCard
                          databaseTableName={databaseTableName}
                          setDatabaseTableName={setDatabaseTableName}
                          addDatabaseTable={addDatabaseTable}
                        />
                        <AddStorageBucketCard
                          storageBucketName={storageBucketName}
                          setStorageBucketName={setStorageBucketName}
                          addStorageBucket={addStorageBucket}
                        />
                      </Accordion>
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
