import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Calendar = () => {
    const [days, setDays] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedColor, setSelectedColor] = useState("blue"); // Color predeterminado
    const [showModal, setShowModal] = useState(false);




    const Holidays = async () => {
        const response = await fetch(
            "https://date.nager.at/api/v3/PublicHolidays/2023/CO"
        );
        const data = await response.json();
        return data;
    };


    useEffect(() => {
        Holidays().then((data) => setDays(data));
    }, []);

    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);
        console.log(arg);
        console.log(arg.date);
        const localName = arg.dayEl.innerText.split("\n")[1];
        const evento = localName === undefined ? "" : localName;
        console.log(evento);
        const date = `${arg.date}`;
        console.log(date.startsWith("Sun") || date.startsWith("Sat"));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveModal = () => {
        const newEvent = {
            localName: selectedTitle,
            date: selectedDate,
            color: selectedColor,
        };

        console.log(newEvent);

        setDays([...days, newEvent]);
        setShowModal(false);
    };

    console.log(days);

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                dateClick={handleDateClick}
                initialView="dayGridMonth"
                locale={"es"}
                editable={true}
                selectable={true}
                events={days.map((day) => {
                    return {
                        title: day.localName,
                        date: day.date,
                        color: day.color || "blue",
                    };
                })}
            />

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Event Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                disabled
                                value={selectedDate}
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput2">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedTitle}
                                onChange={(e) => setSelectedTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Color</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                            >
                                <option value="blue">Azul</option>
                                <option value="red">Rojo</option>
                                <option value="green">Verde</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveModal}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Calendar;

