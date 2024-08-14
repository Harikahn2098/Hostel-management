import React, { useState } from "react";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
import { useEffect } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Progress,
  ModalBody,
  Modal,
  DropdownItem,
  Form,
  Badge,
} from "reactstrap";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Icon,
  Button,
  Col,
  UserAvatar,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  RSelect,
} from "../../../../components/Component";
import { findUpper } from "../../../../utils/Utils";
import { useForm } from "react-hook-form";

export const Room = () => {
  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [editId, setEditedId] = useState();
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;

  useEffect(() => {
    axios
      .get("https://yrpitsolutions.com/hms/api/read_room")
      .then((response) => {
        setData(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [formData, setFormData] = useState({
    room_no: "",
    category: "",
    description: "",
    room_charge:""
  });

  const onInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onFormSubmitBedAssign = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://yrpitsolutions.com/hms/api/save_room", formData);
      console.log("Form submitted successfully:", response.data);
      onFormCancel(); // Close the modal on successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle errors and display appropriate messages
    }
  };

  const onFormCancel = () => {
    setModal({ add: false });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const [editUserId, setEditUserId] = useState(null);
  // Handle edit button click
  const handleEditClick = (item) => {
    setEditUserId(item.id);
    setFormData({
        room_no: item.room_no,
        category: item.category,
        description: item.description,
        room_charge: item.room_charge
    });
    setModal({ edit: true });
  };

  // Handle form submission
  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    console.log("Submitting update for bed ID:", editUserId);
    console.log("Form data:", formData);

    // Check if editUserId is set
    if (!editUserId) {
      console.error("Edit user ID is not set.");
      return;
    }

    // Call the update API
    axios
      .put(`https://yrpitsolutions.com/hms/api/update_room/${editUserId}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Update successful:", response.data);
        // Optionally update the local state or UI
        setEditUserId(null);
        setModal({ edit: false });
      })
      .catch((error) => {
        console.error("Error updating bed:", error);
      });
  };

  const handleDeletelick = (item) => {
    setEditUserId(item.id);
    // Call the delete API
    axios
      .delete(`https://yrpitsolutions.com/hms/api/delete_room/${editUserId}`)
      .then((response) => {
        // Remove the user from the list
        // setUsers(users.filter((user) => user.id !== id));
        // Optionally, handle any additional logic after deletion
        console.log(response);
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Project List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Room</BlockTitle>
              <BlockDes className="text-soft">You have total {data.length} rooms</BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <UncontrolledDropdown>
                        <DropdownMenu end>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Open</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Closed</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <span>Onhold</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Add a room</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <DataTable className="card-stretch">
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow>
                  <span className="sub-text">Room No</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Category</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Room Charge</span>
                </DataTableRow>
                {/* <DataTableRow size="md">
                  <span className="sub-text">Bed</span>
                </DataTableRow> */}
                <DataTableRow className="nk-tb-col-tools text-end">
                  <UncontrolledDropdown>
                    <span className="sub-text">Action</span>
                  </UncontrolledDropdown>
                </DataTableRow>
              </DataTableHead>
              {currentItems.length > 0
                ? currentItems.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow>
                          <a
                            href="#title"
                            onClick={(ev) => {
                              ev.preventDefault();
                            }}
                            className="project-title"
                          >
                            {/* <UserAvatar className="sq" theme={"hgjh"} text={findUpper(item.bed_no)} /> */}
                            <div className="project-info">
                              <h6 className="title">{item.room_no}</h6>
                            </div>
                          </a>
                        </DataTableRow>
                        {/* <DataTableRow size="xxl">
                          <span>{item.category}</span>
                        </DataTableRow> */}
                        <DataTableRow size="lg">
                          <span>{item.category}</span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span>{item.room_charge}</span>
                        </DataTableRow>
                        {/* <DataTableRow size="lg">
                          <span>{item.availability}</span>
                        </DataTableRow> */}
                        {/* <DataTableRow size="lg">
                          <span>{item.room}</span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span>{item.bed}</span>
                        </DataTableRow> */}

                        <DataTableRow className="nk-tb-col-tools text-end">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu end>
                                  <ul className="link-list-opt no-bdr">
                                    <li key={item.id}>
                                      <DropdownItem
                                        tag="a"
                                        href="#edit"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          handleEditClick(item);
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Edit</span>
                                      </DropdownItem>
                                    </li>
                                    <li key={item.id}>
                                      <DropdownItem
                                        tag="a"
                                        // href="#edit"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          handleDeletelick(item);
                                        }}
                                      >
                                        <Icon name="trash"></Icon>
                                        <span>Delete</span>
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {data.length > 0 ? (
                <PaginationComponent
                  itemPerPage={itemPerPage}
                  totalItems={data.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No rooms found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        {/* create new bed */}

        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add a room</h5>

              <form onSubmit={onFormSubmitBedAssign}>
                <div className="mt-4">
                  <div className="row gy-4">
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label">Room No</label>
                        <input
                          type="text"
                          name="room_no"
                          value={formData.room_no}
                          placeholder="Enter room no"
                          onChange={onInputChange}
                          className="form-control"
                        />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={onInputChange}
                          className="form-control"
                        >
                          <option value="">Select Category</option>
                          <option value="Deluxe Room">Deluxe Room</option>
                          <option value="Standard">Standard</option>
                        </select>
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label">Description </label>
                        <input
                          type="text"
                          name="description"
                          value={formData.description}
                          placeholder=""
                          onChange={onInputChange}
                          className="form-control"
                        />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label">Room Charge </label>
                        <input
                          type="text"
                          name="room_charge"
                          value={formData.room_charge}
                          placeholder=""
                          onChange={onInputChange}
                          className="form-control"
                        />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </Col>

                    <Col size="12">
                      <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                        <li>
                          <Button color="primary" size="md" type="submit">
                            Add a room
                          </Button>
                        </li>
                        <li>
                          <Button
                            onClick={(ev) => {
                              ev.preventDefault();
                              onFormCancel();
                            }}
                            className="link link-light"
                          >
                            Cancel
                          </Button>
                        </li>
                      </ul>
                    </Col>
                  </div>
                </div>
              </form>
            </div>
          </ModalBody>
        </Modal>
        {/* update bed */}

        <Modal isOpen={modal.edit} toggle={() => setModal({ edit: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update room</h5>
              <div className="mt-4">
                <form onSubmit={handleSubmit(handleSubmitUpdate)}>
                  <div className="mt-4">
                    <div className="row gy-4">
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label">Room No</label>
                        <input
                          type="text"
                          name="room_no"
                          value={formData.room_no}
                          placeholder="Enter room no"
                          onChange={onInputChange}
                          className="form-control"
                        />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={onInputChange}
                          className="form-control"
                        >
                          <option value="">Select Category</option>
                          <option value="Deluxe Room">Deluxe Room</option>
                          <option value="Standard">Standard</option>
                        </select>
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label">Description </label>
                        <input
                          type="text"
                          name="description"
                          value={formData.description}
                          placeholder=""
                          onChange={onInputChange}
                          className="form-control"
                        />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label">Room Charge </label>
                        <input
                          type="text"
                          name="room_charge"
                          value={formData.room_charge}
                          placeholder=""
                          onChange={onInputChange}
                          className="form-control"
                        />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </Col>

                      <Col size="12">
                        <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                          <li>
                            <Button
                              color="primary"
                              size="md"
                              type="submit"
                              onClick={(ev) => {
                                ev.preventDefault();
                                handleSubmitUpdate(ev); 
                              }}
                            >
                              Update room
                            </Button>
                          </li>
                          <li>
                            <Button
                              onClick={(ev) => {
                                ev.preventDefault();
                                onFormCancel();
                              }}
                              className="link link-light"
                            >
                              Cancel
                            </Button>
                          </li>
                        </ul>
                      </Col>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};

export default Room;
