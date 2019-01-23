# remounting:
- https://stackoverflow.com/questions/32261441/component-does-not-remount-when-route-parameters-change

## case
When the project component loads, I trigger a data request for that project from the componentDidMount event. I'm now running into an issue where if I switch directly between two projects so only the id changes like this...
~~~
myapplication.com/project/982378632
myapplication.com/project/782387223
myapplication.com/project/198731289
~~~

## solution1:
```js
componentWillReceiveProps(newProps){
    console.log('your logic')
}
```

## solution 2-1:
```js
<Route path="/page/:pageid" render={(props) => (
  <Page key={props.match.params.pageid} {...props} />)
} />
```

## solution 2-2
```js
// Based on answers by @wei, @Breakpoint25 and @PaulusLimma I made this replacement component for the <Route>. This will remount the page when the URL changes, forcing all the components in the page to be created and mounted again, not just re-rendered. All componentDidMount() and all other startup hooks are executed also on the URL change.
// The idea is to change components key property when the URL changes and this forces React to re-mount the component.

// You can use it as a drop-in replacement for <Route>, for example like this:

<Router>
  <Switch>
    <RemountingRoute path="/item/:id" exact={true} component={ItemPage} />
    <RemountingRoute path="/stuff/:id" exact={true} component={StuffPage} />
  </Switch>
</Router>

// The <RemountingRoute> component is defined like this:

export const RemountingRoute = (props) => {
  const {component, ...other} = props
  // React 应该是根据大小写来判断组件的
  const Component = component
  return (
    <Route {...other} render={p => <Component key={p.location.pathname + p.location.search}
                                              history={p.history}
                                              location={p.location}
                                              match={p.match} />}
    />)
}

RemountingRoute.propsType = {
  component: PropTypes.object.isRequired
}

// This has been tested with React-Router 4.3.
```