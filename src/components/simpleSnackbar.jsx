import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SimpleSnackbar = (props) => {
	const onClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		props.handleSnackbarClose(false);
	};

	return (
		<>
			<Snackbar
				open={props.openSnackbar}
				autoHideDuration={props.autoHideDuration}
				onClose={onClose}
				anchorOrigin={props.anchorOrigin}
			>
				{/* success  info  warning  error */}
				{/* <Alert severity={props.severity} onClose={() => props.handleSnackbarClose(false)}> */}
				<Alert severity={props.severity} >
					{props.message}
				</Alert>
			</Snackbar >
		</>
	);
};

export default SimpleSnackbar;