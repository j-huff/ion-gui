import React,{ createContext, useContext, useReducer } from 'react';


export const initialState = {
  counter: 0,
  person: {
    age: 0,
    firstName: '',
    lastName: '',
  },
};

export const initialState = {
  config:{
    nodes: {},
    activeStroke: "",
    contextMenu: {opened: false},
    createNodeMenu: {opened: false},
    nodeEditHelpMessages: {},
    createNodeHelpMessages: {},
    machineEditHelpMessages: {},
    nodeEditor: {},
    links: {},
    meta: {
      id: "new",
      author: "No Author",
      projectTitle: "Untitled Project"
    },
    machines: {},
    redirect: false,
    editingMachine: null
  },
  ui:{
    draggingNode: false,
    linkingNode: false,
    hoveringNode: false,
    mouseDown: false,
    createNodeMenu: React.createRef(),
    nodeEditorRef: React.createRef(),
  }
}

export type State = typeof initialState;

export type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setFirstName', firstName: string }
  | { type: 'setLastName', lastName: string }
  | { type: 'setAge', age: number };

const editorReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'save':
      if(state.meta.id === "new"){
        return
      }
      console.log("Saving project")
      fetch("/api/saveProject", {
        method: "POST",
        body: JSON.stringify({id: state.config.meta.id,state:state.config}),
        headers: { "Content-Type": "application/json" }
      }).then(function(res) {
        
        console.log("Project saved")
      }, function(error) {
        console.log(error.message) //=> String
      })
      return state;

  case 'mouseMove':
  


    default: return state;
  }
}

export const reducer = (state: State, action: Action) => {

  state = editorReducer(state, action)

  switch (action.type) {
    case 'increment': return {
      ...state,
      counter: state.counter + 1,
    };
    case 'decrement': return {
      ...state,
      counter: state.counter - 1,
    };
    case 'setFirstName': return {
      ...state,
      person: {
        ...state.person,
        firstName: action.firstName,
      },
    };
    case 'setLastName': return {
      ...state,
      person: {
        ...state.person,
        lastName: action.lastName,
      },
    };
    case 'setAge': return {
      ...state,
      person: {
        ...state.person,
        age: action.age,
      },
    };
    default: return state;
  }
};


export const useStore =()=> {
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state,dispatch]

};

