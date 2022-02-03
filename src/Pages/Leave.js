import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "../App.css";
import Button from "react-bootstrap/Button";
import FullCal from "../Components/FullCalendar";
import Axios from "axios";

function Leave() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Container>
        <Row>
          <h1 className="leave">แจ้งลา</h1>
        </Row>
        <Row>
          <Col sm>จำนวนวันลาพักร้อน</Col>
          <Col sm>จำนวนวันที่ลา</Col>
          <Col sm>ร้องขอการแจ้งลางาน</Col>
        </Row>
        <Row>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="primary" onClick={() => setModalShow(true)}>
              แจ้งลา
            </Button>{" "}
            <MydModalWithGrid
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </div>
        </Row>
        <Row>
          <div style={{ marginBottom: "50px" }}>
            <FullCal />
          </div>
        </Row>
      </Container>
    </>
  );
}

function MydModalWithGrid(props) {
  const [departmentList, setDepartmentList] = useState([]);
  const [dep_id, setDep_id] = useState("");
  const [role_id, setRole] = useState("");
  const [emp_name, setEmpName] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [LeaveList, setLeaveList] = useState([]);

  const [emp_id, setEmp_id] = useState("");
  const [type_leave, setType_leave] = useState("");
  const [leave_desc, setLeave_desc] = useState("");
  const [start_leave, setStart_leave] = useState("");
  const [end_leave, setEnd_leave] = useState("");
  const [summary, setSummary] = useState("");

  const Addleave = () => {
    Axios.post("http://localhost:3333/leavework", {
      emp_id: emp_id,
      dep_id: dep_id,
      type_leave: type_leave,
      leave_desc: leave_desc,
      start_leave: start_leave,
      end_leave: end_leave,
    }).then(() => {
      setLeaveList({
        ...LeaveList,

        emp_id: emp_id,
        dep_id: dep_id,
        type_leave: type_leave,
        leave_desc: leave_desc,
        start_leave: start_leave,
        end_leave: end_leave,
      });
      window.location = "/leave";
    });
  };

  const dataepartment = () => {
    Axios.get("http://localhost:3333/department").then((response) => {
      setDepartmentList(response.data);
    });
  };

  const empList = () => {
    Axios.get("http://localhost:3333/employeesview").then((response) => {
      setEmployeeList(response.data);
    });
  };

  const getAuth = () => {
    const token = localStorage.getItem("token");

    Axios.get("/authen", {
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      console.log(response);
      if (response.data.status == "ok") {
        setRole(response.data.decoded.user.role_id);
        setEmpName(
          response.data.decoded.user.emp_firstname +
            " " +
            response.data.decoded.user.emp_surname
        );
      } else {
        window.location = "/login";
      }
    });
  };

  useEffect(() => {
    getAuth();
    dataepartment();
    empList();
  }, []);

  return (
    <Modal {...props} centered>
      <Modal.Body className="show-grid">
        <Container>
          <Row>
            <h2 className="leaveform" style={{ textAlign: "center" }}>
              แบบฟอร์มแจ้งลางาน
            </h2>
          </Row>
          <Row>
            {departmentList.map((val) => {
              return (
                <Form>
                  <Form.Group
                    className="mb-3 col-12"
                    controlId="formBasicTextInput"
                  >
                    <Form.Label>ชื่อ-สกุล</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="กรอกชื่อ-สกุล"
                      value={emp_name}
                      onChange={(e) => {
                        setEmp_id(e.target.value);
                      }}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicTextInput">
                    <Form.Label>แผนก</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="กรอกแผนก"
                      value={val.dep_name}
                      onChange={(e) => {
                        setDep_id(e.target.value);
                      }}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>ประเภทการลา</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="กรอกประเภทการลา"
                      onChange={(e) => {
                        setType_leave(e.target.value);
                      }}
                    />

                    {/* <Form.Select id="disabledSelect">
                    <option value="0">กรุณาเลือก</option>
                    <option value="1">ชาย</option>
                    <option value="2">หญิง</option>
                </Form.Select> */}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicTextInput">
                    <Form.Label>เนื่องจาก</Form.Label>
                    <textarea
                      class="form-control"
                      type="text-area"
                      placeholder="กรอกเหตุผลที่ลา"
                      onChange={(e) => {
                        setLeave_desc(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>ขอลาตั้งแต่วันที่</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="กรอกวันที่เริ่มลา"
                      onChange={(e) => {
                        setStart_leave(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>ถึงวันที่</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="กรอกวันที่สิ้นสุด"
                      onChange={(e) => {
                        setEnd_leave(e.target.value);
                      }}
                    />
                  </Form.Group>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="danger"
                      onClick={props.onHide}
                      style={{ margin: "10px" }}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      onClick={Addleave}
                      variant="primary"
                      type="submit"
                      style={{ margin: "10px" }}
                    >
                      ยืนยัน
                    </Button>
                  </div>
                </Form>
              );
            })}
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default Leave;
