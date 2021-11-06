import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Popper,
  Stack,
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
    id: 'invoiceNum',
    numeric: false,
    disablePadding: false,
    label: 'Invoice',
  },
  {
    id: 'clientName',
    numeric: false,
    disablePadding: false,
    label: 'Client Name',
  },
  {
    id: 'clientAddress',
    numeric: false,
    disablePadding: false,
    label: 'Client Address',
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
  const [orders, setOrders] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [id, setID] = useState('');
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [chairRemaks, setChairRemaks] = useState([]);

  const [clientName, setClientName] = useState('');
  const [clientDistrict, setClientDistrict] = useState('');
  const [clientStreet, setClientStreet] = useState('');
  const [clientBlock, setClientBlock] = useState('');
  const [clientFloor, setClientFloor] = useState('');
  const [clientUnit, setClientUnit] = useState('');
  const [remark, setRemark] = useState('');

  const [brand, setBrand] = useState();
  const [model, setModel] = useState();
  const [frameColor, setFrameColor] = useState();
  const [backColor, setBackColor] = useState();
  const [seatColor, setSeatColor] = useState();
  const [chairRemark, setChairRemark] = useState();

  const handleEditClick = (event, index) => {
    event.preventDefault();
    if (index < brands.length && index >= 0) {
      setID(orders[index].id);
    }
    setEditOpen(true);
  };

  const handleRemoveClick = (event, index) => {
    event.preventDefault();
    if (index < orders.length && index >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will remove current ChairStock permanently.',
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
              getOrders();
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
      text: 'This action will remove selected Brands permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'No, Keep Them.',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('/chiarstock', { data: { ids: selected } })
          .then((response) => {
            // handle success
            getOrders();
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
  };

  const handleSave = (event) => {
    event.preventDefault();
    axios
      .put(`/chairstock/${id}`, { clientName })
      .then((response) => {
        // handle success
        setEditOpen(false);
        getOrders();
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
      .post(`/chairorder/create`, {
        chairBrand: brand ? brand.id : null,
        chairModel: model ? model.id : null,
        frameColor: frameColor ? frameColor.id : null,
        backColor: backColor ? backColor.id : null,
        seatColor: seatColor ? seatColor.id : null,
        clientName,
        clientDistrict,
        clientStreet,
        clientBlock,
        clientFloor,
        clientUnit,
      })
      .then((response) => {
        // handle success
        setCreateOpen(false);
        getOrders();
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

  const getModels = (cancelToken) => {
    axios
      .get('/chairmodel', { cancelToken })
      .then((response) => {
        // handle success
        setModels(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getOrders = (cancelToken) => {
    axios
      .get('/chairorder', { cancelToken })
      .then((response) => {
        // handle success
        setOrders(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getColors = (cancelToken) => {
    axios
      .get('/productcolor', { cancelToken })
      .then((response) => {
        // handle success
        setColors(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getChairRemaks = (cancelToken) => {
    // axios
    //   .get('/chairremark', { cancelToken })
    //   .then((response) => {
    //     // handle success
    //     setChairRemaks(response.data.map((item) => item.detail));
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   })
    //   .then(function () {
    //     // always executed
    //   });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getOrders(source.token);
    return () => source.cancel('Brand Component got unmounted');
  }, []);

  return (
    <>
      <DataGrid
        rows={orders.map(
          ({
            clientDistrict,
            clientStreet,
            clientBlock,
            clientFloor,
            clientUnit,
            ...restProps
          }) => ({
            ...restProps,
            clientAddress: [
              clientDistrict,
              clientStreet,
              clientBlock,
              clientFloor,
              clientUnit,
            ].join(', '),
          })
        )}
        columns={columns}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
      ></DataGrid>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          getBrands();
          getModels();
          getColors();
          getChairRemaks();
          setCreateOpen(true);
        }}
      >
        Add New Order
      </Button>
      <Dialog open={editOpen}>
        <DialogTitle>Edit ChairOrder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Edit the ChairOrder and Click Save button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="standard"
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
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
      <Dialog fullWidth maxWidth="sm" open={createOpen}>
        <DialogTitle>Edit ChairOrder</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <DialogContentText>
              Please Input Order Name and Click Save button.
            </DialogContentText>
            <Autocomplete
              PopperComponent={(params) => (
                <Popper {...params} sx={{ margin: 0 }}></Popper>
              )}
              disablePortal
              value={brand}
              onChange={(event, newValue) => {
                event.preventDefault();
                setBrand(newValue);
              }}
              options={brands}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="ChairBrand" variant="standard" />
              )}
            />
            <Autocomplete
              disablePortal
              value={model}
              onChange={(event, newValue) => {
                event.preventDefault();
                setModel(newValue);
              }}
              options={models}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="ChairModel" variant="standard" />
              )}
            />
            <Autocomplete
              disablePortal
              value={frameColor}
              onChange={(event, newValue) => {
                event.preventDefault();
                setFrameColor(newValue);
              }}
              options={colors}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="FrameColor" variant="standard" />
              )}
            />
            <Autocomplete
              disablePortal
              value={backColor}
              onChange={(event, newValue) => {
                event.preventDefault();
                setBackColor(newValue);
              }}
              options={colors}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="BackColor" variant="standard" />
              )}
            />
            <Autocomplete
              disablePortal
              value={seatColor}
              onChange={(event, newValue) => {
                event.preventDefault();
                setSeatColor(newValue);
              }}
              options={colors}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="SeatColor" variant="standard" />
              )}
            />

            <Autocomplete
              disablePortal
              freeSolo
              value={chairRemark}
              onChange={(event, newValue) => {
                event.preventDefault();
                setChairRemark(newValue);
              }}
              options={chairRemaks}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chair Remark"
                  variant="standard"
                />
              )}
            />

            {[
              {
                label: 'Client Name',
                value: clientName,
                setValue: setClientName,
                type: 'text',
              },
              {
                label: 'ClientDistrict',
                value: clientDistrict,
                setValue: setClientDistrict,
                type: 'text',
              },
              {
                label: 'ClientStreet',
                value: clientStreet,
                setValue: setClientStreet,
                type: 'text',
              },
              {
                label: 'ClientBlock',
                value: clientBlock,
                setValue: setClientBlock,
                type: 'number',
              },
              {
                label: 'ClientFloor',
                value: clientFloor,
                setValue: setClientFloor,
                type: 'number',
              },
              {
                label: 'ClientUnit',
                value: clientUnit,
                setValue: setClientUnit,
                type: 'number',
              },
              {
                label: 'Remark',
                value: remark,
                setValue: setRemark,
                type: 'text',
              },
            ].map((item, index) => (
              <TextField
                key={index}
                autoFocus
                margin="dense"
                label={item.label}
                fullWidth
                variant="standard"
                value={item.value}
                type={item.type}
                onChange={(e) => {
                  item.setValue(e.target.value);
                }}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              event.preventDefault();
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