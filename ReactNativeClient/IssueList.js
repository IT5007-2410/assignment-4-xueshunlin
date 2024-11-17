import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
    KeyboardAvoidingView
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
    
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <Text>IssueFilter</Text>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa', // Light background color
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#6200EE', // Highlight color
    paddingVertical: 12,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#6200EE', // Highlighted text
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 4,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6200EE',
    marginVertical: 16,
  },
});


const width= [40,80,80,80,80,80,200];

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const rowData = (
      <>
        <Text style={styles.cell}>{issue.id}</Text>
        <Text style={styles.cell}>{issue.status}</Text>
        <Text style={styles.cell}>{issue.owner}</Text>
        <Text style={styles.cell}>{issue.created.toDateString()}</Text>
        <Text style={styles.cell}>{issue.effort}</Text>
        <Text style={styles.cell}>{issue.due ? issue.due.toDateString() : ''}</Text>
        <Text style={styles.cell}>{issue.title}</Text>
      </>
    );
    {/****** Q2: Coding Ends here.******/}
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <View style={styles.row}>
        {rowData}
      </View>
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const tableHeader = (
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>ID</Text>
        <Text style={styles.headerCell}>Status</Text>
        <Text style={styles.headerCell}>Owner</Text>
        <Text style={styles.headerCell}>Created</Text>
        <Text style={styles.headerCell}>Effort</Text>
        <Text style={styles.headerCell}>Due Date</Text>
        <Text style={styles.headerCell}>Title</Text>
      </View>
    );
    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
      <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
    <View style={styles.container}>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
    {tableHeader}
    {issueRows}
    {/****** Q2: Coding Ends here. ******/}
    </View>
    </ScrollView>
    );
  }

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = {
        owner: '',
        title: '',
        effort: '',
        status: 'New',
      };
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleOwnerChange = (text) => {
      this.setState({ owner: text });
    }
  
    handleTitleChange = (text) => {
      this.setState({ title: text });
    }
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const issue = {
        owner: this.state.owner,
        title: this.state.title,
        effort: this.state.effort,
        status: this.state.status,
        due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
      };
      this.props.createIssue(issue);
      console.log("Issue added", issue);
      this.setState({ owner: '', title: '', effort: '', status: 'New' });
      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      return (
          <View>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <TextInput
          style={styles.input}
          placeholder="Owner"
          value={this.state.owner}
          onChangeText={(text) => this.setState({ owner: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={this.state.title}
          onChangeText={(text) => this.setState({ title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Effort (in hours)"
          value={this.state.effort}
          onChangeText={(text) => this.setState({ effort: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Status"
          value={this.state.status}
          onChangeText={(text) => this.setState({ status: text })}
        />
        <Button title="Add" onPress={this.handleSubmit} />
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = {name: ''}
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setName = (newname) => {
        this.setState({name: newname});
    }
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const query = `mutation myaddToBlacklist($newname: String!) {
        addToBlacklist(nameInput: $newname)
    }`;
    const newname = this.state.name;
    console.log(newname);
    const data = await graphQLFetch(query, {newname});
    this.newnameInput.clear();
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <TextInput ref={input => { this.newnameInput = input;}} placeholder="Name to Blacklist" onChangeText={newname => this.setName(newname)} />
        <Button onPress={this.handleSubmit} title="Add to Blacklist" />
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }
    
    
    render() {
    return (
    <>
    {/****** Q1: Start Coding here. ******/}
    <IssueFilter/>
    {/****** Q1: Code ends here ******/}


    {/****** Q2: Start Coding here. ******/}
    <IssueTable issues={this.state.issues}/>
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
    <IssueAdd createIssue={this.createIssue}/>
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
    <BlackList/>
    {/****** Q4: Code Ends here. ******/}
    </>
      
    );
  }
}
