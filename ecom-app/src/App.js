import './App.css';

import { Route, Switch, Link, BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, Nav } from "react-bootstrap";
import CustomersPage from "./COMPONENTS/customersPage";
import ProductsPage from "./COMPONENTS/productsPage";
import Bills from './COMPONENTS/billsPage';
import { useEffect } from "react";

function App() {

  // const dispatch = useDispatch()

  useEffect(() => {
    console.log('initialize data ...')
    // StoreService.init();
  }, [])

  return (
    <Router>

      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">ECOM-APP</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Link className="nav-link" to="/home">Home</Link>
            <Link className="nav-link" to="/customers">Customers</Link>
            <Link className="nav-link" to="/products">Products</Link>
            <Link className="nav-link" to="/bills">Bills</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Switch>
        <Route exact path="/customers" component={CustomersPage}></Route>
        <Route exact path="/products" component={ProductsPage}></Route>
        <Route exact path="/bills" component={Bills}></Route>
      </Switch>

    </Router>
  );
}

export default App;
