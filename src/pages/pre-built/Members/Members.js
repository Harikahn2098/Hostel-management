import React, { useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
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
} from "../../../components/Component";
import { useForm } from "react-hook-form";

export const Members = () => {
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
      .get("https://yrpitsolutions.com/hms/api/read_customer")
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
    name: "",
    institute: "",
    date_of_birth: "",
    gender: "",
    religion: "",
    email: "",
    phone: "",
    address: "",
    joining_date: "",
    guardian_name: "",
    guardian_phone: "",
    photo: null,
    government_id_proof: null,
  });

  const onInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const onFormSubmit = async () => {
    const form = new FormData();

    // Append form fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        form.append(key, formData[key]);
      } else if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    try {
      await axios.post("https://yrpitsolutions.com/hms/api/save_customer", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Handle success
      console.log("Form submitted successfully");
      resetForm();
      setModal({ edit: false }, { add: false });
    } catch (error) {
      // Handle error
      console.error("Error submitting form", error);
    }
  };


  const onFormCancel = () => {
    setModal({ add: false });
    setFormData({
      name: '',
      institute: '',
      date_of_birth: '',
      gender: '',
      religion: '',
      email: '',
      phone: '',
      address: '',
      joining_date: '',
      guardian_name: '',
      guardian_phone: '',
      photo: null,
      government_id_proof: null,
    });
    // setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const [editUserId, setEditUserId] = useState(null);
  // Handle edit button click
  const handleEditClick = (item) => {
    setEditUserId(item.id);
    setFormData({
      name: item.name,
      institute: item.institute,
      date_of_birth: item.date_of_birth,
      gender: item.gender,
      religion: item.religion,
      email: item.email,
      phone: item.phone,
      address: item.address,
      joining_date: item.joining_date,
      photo: item.photo,
      government_id_proof: item.government_id_proof,
    });
    setModal({ edit: true });
  };

  
  
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    
    const form = new FormData();
    
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        form.append(key, formData[key]);
      } else if (formData[key]) {
        form.append(key, formData[key]);
      }
    });
    
    try {
      await axios.put(
        `https://yrpitsolutions.com/hms/api/update_customer/${editUserId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Form submitted successfully");
      resetForm();
      setModal({ edit: false });
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const handleDeleteClick = (item) => {
    setEditUserId(item.id);
    // Call the delete API
    axios
      .delete(`https://yrpitsolutions.com/hms/api/delete_hostel_list/${editUserId}`)
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
              <BlockTitle page> Members</BlockTitle>
              <BlockDes className="text-soft">You have total {data.length} members</BlockDes>
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
                        <span>Add a member</span>
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
                  <span className="sub-text">Name</span>
                </DataTableRow>
               
                <DataTableRow size="lg">
                  <span className="sub-text">Email</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Phone</span>
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
                            <UserAvatar className="sq"  image={item.photo}/>
                            <div className="project-info">
                              <h6 className="title">{item.name}</h6>
                            </div>
                          </a>
                        </DataTableRow>
                        <DataTableRow size="xxl">
                          <span>{item.name}</span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span>{item.email}</span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span>{item.phone}</span>
                        </DataTableRow>
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
                                          handleDeleteClick(item);
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
                  <span className="text-silent">No members found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        {/* create members */}

        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add member</h5>
              <div className="mt-4">
                <Form
                  className="row gy-4"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    onFormSubmit();
                  }}
                >
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Enter Name"
                        onChange={handleInputChange}
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Institute</label>
                      <input
                        className="form-control"
                        type="text"
                        name="institute"
                        value={formData.institute}
                        placeholder="Enter Institute"
                        onChange={handleInputChange}
                      />
                      {errors.institute && <span className="invalid">{errors.institute.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        className="form-control"
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                      />
                      {errors.date_of_birth && <span className="invalid">{errors.date_of_birth.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">gender</label>
                      <div className="custom-select-wrapper">
                        <select
                          className="form-control"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      {errors.gender && <span className="invalid">{errors.gender.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Religion</label>
                      <input
                        className="form-control"
                        type="text"
                        name="religion"
                        value={formData.religion}
                        placeholder="Enter Religion"
                        onChange={handleInputChange}
                      />
                      {errors.religion && <span className="invalid">{errors.religion.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter Email"
                        onChange={handleInputChange}
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="phone"
                        value={formData.phone}
                        placeholder="Enter Phone Number"
                        onChange={handleInputChange}
                      />
                      {errors.phone && <span className="invalid">{errors.phone.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        type="text"
                        name="address"
                        value={formData.address}
                        placeholder="Enter Address"
                        onChange={handleInputChange}
                      />
                      {errors.address && <span className="invalid">{errors.address.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Joining Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="joining_date"
                        value={formData.joining_date}
                        onChange={handleInputChange}
                      />
                      {errors.joining_date && <span className="invalid">{errors.joining_date.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Guardian Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="guardian_name"
                        value={formData.guardian_name}
                        placeholder="Enter Guardian Name"
                        onChange={handleInputChange}
                      />
                      {errors.guardian_name && <span className="invalid">{errors.guardian_name.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Guardian Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="guardian_phone"
                        value={formData.guardian_phone}
                        placeholder="Enter Guardian Phone Number"
                        onChange={handleInputChange}
                      />
                      {errors.guardian_phone && <span className="invalid">{errors.guardian_phone.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Photo</label>
                      <input className="form-control" type="file" name="photo" onChange={handleInputChange} />
                      {errors.photo && <span className="invalid">{errors.photo.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Government Id Proof</label>
                      <input
                        className="form-control"
                        type="file"
                        name="government_id_proof"
                        onChange={handleInputChange}
                      />
                      {errors.government_id_proof && (
                        <span className="invalid">{errors.government_id_proof.message}</span>
                      )}
                    </div>
                  </Col>
                  {/* <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatus}
                          value={{ value: formData.status, label: formData.status }}
                          onChange={handleStatusChange}
                        />
                      </div>
                    </div>
                  </Col> */}
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Add Member
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
        {/* update members */}

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
              <h5 className="title">Update member</h5>
              <div className="mt-4">
                <form onSubmit={handleSubmit(handleSubmitUpdate)}>
                  <div className="mt-4">
                    <div className="row gy-4">
                    <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Enter Name"
                        onChange={handleInputChange}
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Institute</label>
                      <input
                        className="form-control"
                        type="text"
                        name="institute"
                        value={formData.institute}
                        placeholder="Enter Institute"
                        onChange={handleInputChange}
                      />
                      {errors.institute && <span className="invalid">{errors.institute.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        className="form-control"
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                      />
                      {errors.date_of_birth && <span className="invalid">{errors.date_of_birth.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">gender</label>
                      <div className="custom-select-wrapper">
                        <select
                          className="form-control"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      {errors.gender && <span className="invalid">{errors.gender.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Religion</label>
                      <input
                        className="form-control"
                        type="text"
                        name="religion"
                        value={formData.religion}
                        placeholder="Enter Religion"
                        onChange={handleInputChange}
                      />
                      {errors.religion && <span className="invalid">{errors.religion.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter Email"
                        onChange={handleInputChange}
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="phone"
                        value={formData.phone}
                        placeholder="Enter Phone Number"
                        onChange={handleInputChange}
                      />
                      {errors.phone && <span className="invalid">{errors.phone.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        type="text"
                        name="address"
                        value={formData.address}
                        placeholder="Enter Address"
                        onChange={handleInputChange}
                      />
                      {errors.address && <span className="invalid">{errors.address.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Joining Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="joining_date"
                        value={formData.joining_date}
                        onChange={handleInputChange}
                      />
                      {errors.joining_date && <span className="invalid">{errors.joining_date.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Guardian Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="guardian_name"
                        value={formData.guardian_name}
                        placeholder="Enter Guardian Name"
                        onChange={handleInputChange}
                      />
                      {errors.guardian_name && <span className="invalid">{errors.guardian_name.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Guardian Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="guardian_phone"
                        value={formData.guardian_phone}
                        placeholder="Enter Guardian Phone Number"
                        onChange={handleInputChange}
                      />
                      {errors.guardian_phone && <span className="invalid">{errors.guardian_phone.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Photo</label>
                      <input className="form-control" type="file" name="photo" onChange={handleInputChange} />
                      {errors.photo && <span className="invalid">{errors.photo.message}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Government Id Proof</label>
                      <input
                        className="form-control"
                        type="file"
                        name="government_id_proof"
                        onChange={handleInputChange}
                      />
                      {errors.government_id_proof && (
                        <span className="invalid">{errors.government_id_proof.message}</span>
                      )}
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
                              Update member
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

export default Members;
