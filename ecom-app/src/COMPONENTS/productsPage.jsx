import React, { PureComponent } from 'react'
import { Container, Form, Row, Col, FormControl, Button, Modal, Table } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import ProductsService from "../SERVICES/productsService";

class ProductsPage extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            listProducts: [],
            currentPage: 0,
            totalElements: 0,
            show: false,
            product: { id: null, name: null, price: null, quantity: null }
        }
    }

    updateState = () => {
        ProductsService.getProducts(this.state.currentPage)
            .then((resp) => {
                let data = resp.data
                this.setState({
                    listProducts: data._embedded.products,
                    listProductsFull: data._embedded.products,
                    totalElements: data.page.totalElements
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
                product: {
                    id: this.state.product.id,
                    name: this.state.name,
                    price: this.state.price,
                    quantity: this.state.quantity,
                }
            }, () => {
                console.log('Product to add')
                console.log(this.state.product)
                ProductsService.saveProduct(this.state.product)
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

    searchProduct = (event) => {
        event.preventDefault()

        let keyword = this.state.keyword.toLowerCase()

        if (keyword === "") {
            this.setState({
                listProducts: this.state.listProductsFull
            })
        }
        else {
            let filtered = this.state.listProductsFull.filter(function (product, index, arr) {
                return product.name.toLowerCase().includes(keyword)
            })

            this.setState({
                listProducts: filtered
            })
        }

    }

    render() {

        return (
            <Container>

                {/* Search Form */}
                <Form
                    onSubmit={this.searchProduct}
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
                                        this.searchProduct(event)
                                    })
                                }
                            />
                        </Col>
                        <Col className="col-auto">
                            <Button variant="outline-primary" type="submit">Search</Button>
                        </Col>
                    </Row>

                </Form>

                {/* List Products */}

                <Row className="mt-5">
                    <Col>
                        <h4>Products List</h4>
                    </Col>

                    <Col className="col-auto">
                        <Button
                            variant="outline-primary"
                            onClick={
                                () => {
                                    this.setState({
                                        product: {}
                                    }, () => {
                                        console.log(this.state.product)
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
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.listProducts.map((p, index) =>
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{p.name}</td>
                                        <td>{p.price}</td>
                                        <td>{p.quantity}</td>
                                        <td>
                                            {
                                                <div className="d-flex justify-content-center">
                                                    <Button variant="outline-success"
                                                        className="mr-3"
                                                        onClick={
                                                            () => {
                                                                this.setState({
                                                                    product: p
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
                                                                ProductsService.deleteProduct(p.id)
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
                        <Modal.Title>Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form onSubmit={this.saveChanges}>

                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    name="name"
                                    defaultValue={this.state.product.name}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter price"
                                    name="price"
                                    min="1"
                                    defaultValue={this.state.product.price}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formQuantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter quantity"
                                    name="quantity"
                                    min="1"
                                    defaultValue={this.state.product.quantity}
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

export default ProductsPage