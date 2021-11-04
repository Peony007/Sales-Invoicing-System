import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'Id',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Brand = connect(mapStateToProps)((props) => {
  const [brands, setBrands] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [id, setID] = useState('');
  const [name, setName] = useState('');

  const handleEditClick = (event, index) => {
    event.preventDefault();
    if (index < brands.length && index >= 0) {
      setID(brands[index].id);
      setName(brands[index].name);
    }
    setEditOpen(true);
  };

  const handleRemoveClick = (event, index) => {
    event.preventDefault();
    if (index < brands.length && index >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will remove current ChairBrand permanently.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove!',
        cancelButtonText: 'No, Keep It.',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/chairbrand/${brands[index].id}`)
            .then((response) => {
              // handle success
              getBrands();
            })
            .catch(function (error) {
              // handle error
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
                allowOutsideClick: false,
              });
              console.log(error);
            })
            .then(function () {
              // always executed
            });
        }
      });
    }
  };

  const handleBulkRemoveClick = (selected) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will remove selected ChairBrands permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'No, Keep Them.',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('/chairbrand', { data: { ids: selected } })
          .then((response) => {
            // handle success
            getBrands();
            resolve();
          })
          .catch(function (error) {
            // handle error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message,
              allowOutsideClick: false,
            });
            console.log(error);
            reject();
          })
          .then(function () {
            // always executed
          });
      }
    });
  };

  const handleSave = (event) => {
    event.preventDefault();
    axios
      .put(`/chairbrand/${id}`, { name })
      .then((response) => {
        // handle success
        setEditOpen(false);
        getBrands();
      })
      .catch(function (error) {
        // handle error
        setEditOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setEditOpen(true);
        });
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const handleCreate = (event) => {
    event.preventDefault();
    axios
      .post(`/chairbrand/create`, { name })
      .then((response) => {
        // handle success
        setCreateOpen(false);
        getBrands();
      })
      .catch(function (error) {
        // handle error
        setCreateOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setCreateOpen(true);
        });
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getBrands = (cancelToken) => {
    axios
      .get('/chairbrand', { cancelToken })
      .then((response) => {
        // handle success
        setBrands(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getBrands(source.token);
    return () => source.cancel('Brand Component got unmounted');
  }, []);

  return (
    <>
      <DataGrid
        rows={brands}
        columns={columns}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
      ></DataGrid>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          setName('');
          setCreateOpen(true);
        }}
      >
        Add New Brand
      </Button>
      <Dialog open={editOpen}>
        <DialogTitle>Edit ChairBrand</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Edit the ChairBrand and Click Save button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={createOpen}>
        <DialogTitle>Edit ChairBrand</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Input ChairBrand Name and Click Save button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Brand;