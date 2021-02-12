import React, { PureComponent } from 'react'
import { Container, Form, Row, Col, FormControl, Button, Modal, Table } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import KeycloakService from "../SERVICES/keycloakService";
import CustomersService from "../SERVICES/customersService";

class CustomersPage extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            listCustomers: [],
            currentPage: 0,
            totalElements: 0,
            show: false,
            customer: { id: null, name: null, email: null }
        }
    }

    updateState = () => {
        CustomersService.getCustomers(this.state.currentPage)
            .then((resp) => {
                let data = resp.data
                this.setState({
                    listCustomers: data._embedded.customers,
                    listCustomersFull: data._embedded.customers,
                    totalElements: data.page.totalElements
                })
            }).catch(err => {
                console.log(err)
            })
    }

    componentDidMount = () => {
        console.log(KeycloakService.getToken())
        this.updateState()
    }

    handleChange = (event) => {
        this.setState(
            {
                [event.target.name]: event.target.value,
            });
    }

    saveChanges = (event) => {
        event.preventDefault();
        this.setState(
            {
                customer: {
                    id: this.state.customer.id,
                    name: this.state.name,
                    email: this.state.email,
                }
            }, () => {
                console.log('Customer to add')
                console.log(this.state.customer)
                CustomersService.saveCustomer(this.state.customer)
                    .then((resp) => {
                        console.log("saved !")
                        this.updateState()
                    }).catch(err => {
                        console.log(err)
                    })
                this.handleClose()
            }
        )

    }

    handlePageChange(pageNumber) {
        this.setState({
            currentPage: pageNumber - 1
        }, () => {
            this.updateState()
        })
    }

    handleClose = () => {
        this.setState({ show: false })
    }

    handleShow = () => {
        this.setState({ show: true })
    }

    searchCustomer = (event) => {
        event.preventDefault()

        let keyword = this.state.keyword.toLowerCase()

        if (keyword === "") {
            this.setState({
                listCustomers: this.state.listCustomersFull
            })
        }
        else {
            let filtered = this.state.listCustomersFull.filter(function (customer, index, arr) {
                return customer.name.toLowerCase().includes(keyword) || customer.email.toLowerCase().includes(keyword)
            })

            this.setState({
                listCustomers: filtered
            })
        }

    }

    render() {

        return (
            <Container>

                {/* Search Form */}
                <Form
                    onSubmit={this.searchCustomer}
                    className="mt-5">
                    <Row>
                        <Col>
                            <FormControl
                                type="text"
                                name="keyword"
                                defaultValue=""
                                placeholder="Search ..."
                                onChange={event =>
                                    this.setState({
                                        [event.target.name]: event.target.value
                                    }, () => {
                                        this.searchCustomer(event)
                                    })
                                }
                            />
                        </Col>
                        <Col className="col-auto">
                            <Button variant="outline-primary" type="submit">Search</Button>
                        </Col>
                    </Row>

                </Form>

                {/* List Customers */}

                <Row className="mt-5">
                    <Col>
                        <h4>Customers List</h4>
                    </Col>

                    <Col className="col-auto">
                        <Button
                            variant="outline-primary"
                            onClick={
                                () => {
                                    this.setState({
                                        customer: {}
                                    }, () => {
                                        console.log(this.state.customer)
                                        this.handleShow()
                                    })
                                }
                            }>
                            Add
                        </Button>
                    </Col>
                </Row>


                <div className=" table-wrap">
                    <Table striped bordered className="mt-3">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.listCustomers.map((c, index) =>
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.name}</td>
                                        <td>{c.email}</td>
                                        <td>
                                            {
                                                <div className="d-flex justify-content-center">
                                                    <Button variant="outline-success"
                                                        className="mr-3"
                                                        onClick={
                                                            () => {
                                                                this.setState({
                                                                    customer: c
                                                                }, () => {
                                                                    this.handleShow()
                                                                })
                                                            }
                                                        }
                                                    >
                                                        update
                                                </Button>
                                                    <Button variant="outline-danger"
                                                        onClick={
                                                            () => {
                                                                CustomersService.deleteCustomer(c.id)
                                                                    .then((resp) => {
                                                                        console.log("deleted !")
                                                                        this.updateState()
                                                                    }).catch(err => {
                                                                        console.log(err)
                                                                    })
                                                            }
                                                        }>
                                                        delete
                                                </Button>
                                                </div>
                                            }
                                        </td>
                                    </tr>,
                                )
                            }

                        </tbody>
                    </Table>
                </div>
                <Modal show={this.state.show} onHide={this.handleClose} animation={false} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form onSubmit={this.saveChanges}>

                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    name="name"
                                    defaultValue={this.state.customer.name}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    defaultValue={this.state.customer.email}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit"
                                className="mr-3">
                                Save
                        </Button>

                            <Button variant="secondary" onClick={this.handleClose}>
                                Cancel
                        </Button>
                        </Form>
                    </Modal.Body>

                </Modal>

                {/* Pagination */}

                <Pagination
                    hideNavigation
                    totalItemsCount={this.state.totalElements}
                    pageRangeDisplayed={5}
                    activePage={this.state.currentPage + 1}
                    itemsCountPerPage={5}
                    itemClass="page-item"
                    linkClass="page-link"
                    onChange={this.handlePageChange.bind(this)}
                />
            </Container>
        );
    }
}

export default CustomersPage