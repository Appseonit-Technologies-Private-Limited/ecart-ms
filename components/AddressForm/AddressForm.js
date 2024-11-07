import { useContext, useEffect, useState } from "react"
import { DataContext } from "../../store/GlobalState"
import { ADDRESS_EDIT, ADDRESS_NEW, CITIES_ARR, CONTACT_ADMIN_ERR_MSG, COUNTRIES_ARR, STATES_ARR } from "../../utils/constants"
import { getAddressObj, validateAddress } from "../Cart/util"
import { updateAddress } from "./util"
import { log_error, log_info } from "../../middleware/log"

const AddressForm = ({ formRef, addressObj, saveType, isProfilePage, addressEditCB, addressIndex, handleNewAddressSave }) => {

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        countryState: '',
        country: '',
        pinCode: '',
        phoneNumber: '',
        isDefault: false
    });

    const { state, dispatch } = useContext(DataContext)
    const { auth } = state

    useEffect(() => { if (addressObj) setFormData(addressObj) }, [addressObj]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        try {
            //const formRefData = new FormData(formRef.current); // Get form data

            // Convert FormData to a regular object
            //const formData = Object.fromEntries(formRefData.entries());
            log_info('Form Data:', formData);
            const validateAddressMsg = validateAddress(formData);
            if (validateAddressMsg) return dispatch({ type: 'NOTIFY', payload: { error: validateAddressMsg } });
            updateAddress(saveType, formData, dispatch, auth);
            $('#confirmModal').modal('hide');
            if (saveType === ADDRESS_EDIT && addressEditCB) addressEditCB(formData, addressIndex);
            if (saveType === ADDRESS_NEW && handleNewAddressSave) handleNewAddressSave(formData);
        } catch (error) {
            log_error('Error saving address:', error);
            return dispatch({ type: 'NOTIFY', payload: { error: 'Error saving new address! ' + CONTACT_ADMIN_ERR_MSG } });
        }
    }

    return (
        <form ref={formRef} id="addressForm">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" name="fullName" id="fullName"
                className="form-control mb-2" value={formData.fullName}
                maxLength="50"
                onChange={handleChange}
            />

            <label htmlFor="address">Flat, House no., Building Name, Street Address</label>
            <textarea type="text" name="address" id="address"
                maxLength="50"
                className="form-control mb-2" value={formData.address}
                onChange={handleChange}
            />
            <div className="row gx-2">
                <div className="col-xl-4">
                    <label htmlFor="city">City</label>
                    <input type="text" name="city" id="city"
                        className="form-control mb-2" value={formData.city}
                        maxLength="50"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-xl-4 pl-md-1">
                    <label htmlFor="countryState">State</label>
                    <input type="text" name="countryState" id="countryState"
                        className="form-control mb-2" value={formData.countryState}
                        maxLength="50"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-xl-4 pl-md-1">
                    <label htmlFor="country">Country</label>
                    <input type="text" name="country" id="country"
                        className="form-control mb-2" value={formData.country}
                        maxLength="50"
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="row gx-2">
                <div className="col-xl-6 pl-md-1">
                    <label htmlFor="pinCode">Pin Code</label>
                    <input type="text" name="pinCode" id="pinCode"
                        className="form-control mb-2" value={formData.pinCode}
                        maxLength="10"
                        onChange={handleChange} />
                </div>
                <div className="col-xl-6 pl-md-1">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="text" name="phoneNumber" id="phoneNumber"
                        className="form-control mb-2" value={formData.phoneNumber}
                        maxLength="10"
                        onChange={handleChange} />
                </div>
            </div>
            {isProfilePage &&
                <div className="row pt-2">
                    <input className="mt-1" type='checkbox' checked={formData.isDefault}
                        onChange={(e) => setFormData((prevData) => ({ ...prevData, isDefault: e.target.checked }))}
                    />
                    <p className="pl-2">Mark as default address</p>
                </div>
            }
            <button className="btn btn-primary my-2 cartPayBtn" onClick={handleSaveAddress}>Save Address</button>
        </form>
    )
}

export default AddressForm;