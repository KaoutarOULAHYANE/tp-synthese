import React, { PureComponent } from 'react'
import { Container, Form, Row, Col, FormControl, Button, Modal, Table } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import BillsService from "../SERVICES/billsService"
import CustomersService from "../SERVICES/customersService"
import ProductsService from "../SERVICES/productsService"

class BillsPage extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            listBills: [],
            listCustomers: [],
            listProducts: [],
            currentPage: 0,
            totalElements: 0,
            show: false,
            bill: { id: null, billingDate: '' , customerID: null, productItems: []}
        }
    }

    updateState = () => {
        BillsService.getBills(this.state.currentPage)
            .then((resp) => {
                let data = resp.data
                this.setState({
                    listBills: data.content,
                    listBillsFull: data.content,
                    totalElements: data.totalElements
                })
            }).catch(err => {
                console.log(err)
            })

        ProductsService.getProducts(this.state.currentPage)
            .then((resp) => {
                let data = resp.data
                this.setState({
                    listProducts: data._embedded.products,
                })
            }).catch(err => {
                console.log(err)
            })

        CustomersService.getCustomers(this.state.currentPage)
            .then((resp) => {
                let data = resp.data
                this.setState({
                    listCustomers: data._embedded.customers,
                })
            }).catch(err => {
                console.log(err)
            })
    }

    componentDidMount = () => {
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
                    id: this.state.bill.id,
                    name: this.state.name,
                }
            }, () => {
                console.log('Bill to add')
                console.log(this.state.bill)
                // CustomersService.saveCustomer(this.state.customer)
                //     .then((resp) => {
                //         console.log("saved !")
                //         this.updateState()
                //     }).catch(err => {
                //         console.log(err)
                //     })
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

    render() {

        return (
            <Container>

                {/* Search Form */}
                <Form
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
                                        // this.searchCustomer(event)
                                    })
                                }
                            />
                        </Col>
                        <Col className="col-auto">
                            <Button variant="outline-primary">Search</Button>
                        </Col>
                    </Row>

                </Form>

                {/* List Bills */}

                <Row className="mt-5">
                    <Col>
                        <h4>Bills List</h4>
                    </Col>

                    <Col className="col-auto">
                        <Button
                            variant="outline-primary"
                            onClick={
                                () => {
                                    this.setState({
                                        bill: { id: null, billingDate: '' , customerID: null, productItems: []}
                                    }, () => {
                                        console.log(this.state.bill)
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
                                <th>Date</th>
                                <th>Products</th>
                                <th>Customer ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.listBills.map((b, index) =>
                                    <tr key={b.id}>
                                        <td>{b.id}</td>
                                        <td>{b.billingDate.split('T')[0]}</td>
                                        <td>
                                            {
                                                b.productItems.map((p, index) => 
                                                <li key={p.id}>
                                                    {p.product.name}
                                                </li>)
                                            }
                                        </td>
                                        <td>{b.customerID}</td>
                                        <td>
                                            {
                                                <div className="d-flex justify-content-center">
                                                    <Button variant="outline-success"
                                                        className="mr-3"
                                                        onClick={
                                                            () => {
                                                                this.setState({
                                                                    bill: b
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
                                                                // CustomersService.deleteCustomer(c.id)
                                                                //     .then((resp) => {
                                                                //         console.log("deleted !")
                                                                //         this.updateState()
                                                                //     }).catch(err => {
                                                                //         console.log(err)
                                                                //     })
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
                        <Modal.Title>Bill</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form onSubmit={this.saveChanges}>

                            <Form.Group controlId="formDate">
                                <Form.Label>Date création</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Enter name"
                                    name="billingDate"
                                    defaultValue={this.state.bill.billingDate.split('T')[0]}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formCustomer">
                                <Form.Label>Customer ID</Form.Label>
                                <Form.Control as="select">
                                    {
                                        this.state.listCustomers.map((c, index) =>
                                            <option
                                                key={c.id}
                                                selected={this.state.bill.customerID == c.id}>
                                                {c.id} : {c.name}
                                            </option>
                                        )
                                    }
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formProducts">
                                <Form.Label>Products</Form.Label>
                                <Form.Control as="select" multiple>
                                    {
                                        console.log(this.state.bill.productItems),
                                        this.state.listProducts.map((p, index) =>
                                            <option
                                                key={p.id}
                                                >
                                                {p.id} : {p.name}
                                            </option>
                                        )
                                    }
                                </Form.Control>
                            </Form.Group>

                            {/* <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    defaultValue={this.state.customer.email}
                                    onChange={this.handleChange}
                                />
                            </Form.Group> */}

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

export default BillsPage