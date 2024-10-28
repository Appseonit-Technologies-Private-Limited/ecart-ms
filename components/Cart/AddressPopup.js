import { PROCESSING_MSG, SIGNING_MSG, SIGN_IN } from "../../utils/constants";

export const AddressPopup = (auth, dispatch, cb) => {




    const AddressList = () =>{
        return(<>
        AddressList
        </>)
    }

  
      $('#confirmModal').modal('show');
      dispatch({
        type: 'ADD_MODAL',
        payload: {
          title: 'Please choose a address or enter your new address',
          content: <AddressList loadingMsg = {PROCESSING_MSG} isPopUp={true} executeSignInCallback={cb}/>,
          data: {},
          type: SIGN_IN
        }
      })
}