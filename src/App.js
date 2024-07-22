import "./App.css";
import React, { useEffect, useState } from "react";
import List from "./components/List";
import Aert from "./components/Aert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState(list);

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    setFilteredList(
      list.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !category) {
      showAlert(true, "danger", "Please enter value and category!");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name, category: category };
          }
          return item;
        })
      );
      setName("");
      setCategory("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "Value changed");
    } else {
      showAlert(true, "success", "Item added to the list");
      const newItem = { id: new Date().getTime().toString(), title: name, category: category };
      setList([...list, newItem]);
      setName("");
      setCategory("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilteredList(
      list.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const removeItem = (id) => {
    showAlert(true, "danger", "Item removed");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const editItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(editItem.title);
    setCategory(editItem.category);
  };

  const clearList = () => {
    showAlert(true, "danger", "Empty list");
    setList([]);
  };

  const categorizedList = filteredList.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <section className="section-center">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="task-form">
          {alert.show && <Aert {...alert} removeAlert={showAlert} list={list} />}
          <div className="form-control">
            <input
              type="text"
              placeholder="e.g. Practice"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              type="text"
              placeholder="Category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />
          </div>
          <button type="submit" className="btn btn-success">
            {isEditing ? "Edit" : "Submit"}
          </button>
        </form>
        <form onSubmit={handleSearch} className="form-control search-form">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>
      {Object.keys(categorizedList).map((category) => (
        <div key={category} className="category-container">
          <h3>{category}</h3>
          <List items={categorizedList[category]} removeItem={removeItem} editItem={editItem} />
        </div>
      ))}
      {list.length > 0 && (
        <div className="text-center">
          <button className="btn btn-warning" onClick={clearList}>
            Clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
