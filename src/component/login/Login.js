import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
// import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {withStyles} from '@material-ui/styles';
import axios from 'axios';
import XLSX from 'xlsx';
import md5 from 'md5';
// import fileDownload from 'js-file-download';

const useStyles = ({
    paper: {
        marginTop: "64px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: "8px",
        backgroundColor: "#dc004e",
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: "8px",
    },
    submit: {
        margin: "24px 0px 16px",
    },
});

class Copyright extends Component {
    render() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://www.facebook.com/profile.php?id=100013548901162">
                    myZing
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }
}

class SignIn extends Component {
    onSubmit(e) {
        e.preventDefault();
        axios.post(
            'http://localhost:8080/rest/v1/schedules/login',
            {
                'username': 'AT130444', 'password': md5('0948057858')
            },
            {
                responseType: 'arraybuffer',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            }
        )
            .then(function (response) {
                let blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
                let fr = new FileReader();
                fr.onload = function (evt) {
                    let res = new Uint8Array(evt.target.result);
                    let binary = "";
                    let length = res.byteLength;
                    for (let i = 0; i < length; i++) {
                        binary += String.fromCharCode(res[i]);
                    }
                    let oFile = XLSX.read(binary, {type: 'binary', cellDates: true, cellStyles: true});
                    let wookSheet = oFile.Sheets.ThoiKhoaBieuSV
                    let ref = oFile.Sheets.ThoiKhoaBieuSV['!ref']
                    let colMax = ref.split(':')[1].substring(0, 1)
                    let rowMax = ref.split(':')[1].substring(1, ref.split(':')[1].length)
                    console.log(colMax + '-' + rowMax)
                    console.log(oFile.Sheets.ThoiKhoaBieuSV)
                    console.log()
                    let listTKB = []
                    for (let j = 11; j < parseInt(rowMax)-8; j++) {
                        let objectTKB = {
                            'dayOfWeek': wookSheet['A' + j] === undefined ? '' :wookSheet['A' + j].v,
                            'codeName': wookSheet['B' + j] === undefined ? '' :wookSheet['B' + j].v,
                            'name': wookSheet['D' + j] === undefined ? '' :wookSheet['D' + j].v,
                            'class': wookSheet['E' + j] === undefined ? '' :wookSheet['E' + j].v,
                            'teacher': wookSheet['H' + j] === undefined ? '' :wookSheet['H' + j].v,
                            'lesson': wookSheet['I' + j] === undefined ? '' :wookSheet['I' + j].v,
                            'room': wookSheet['J' + j] === undefined ? '' :wookSheet['J' + j].v,
                            'time': wookSheet['K' + j] === undefined ? '' :wookSheet['K' + j].v
                        }
                        listTKB.push(objectTKB)
                    }
                    console.log(listTKB)
                };
                fr.readAsArrayBuffer(blob);

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const {classes} = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar} src="/LogoHVKTMM.png">
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Đăng nhập
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Mã sinh viên"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mật khẩu"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Đăng nhập
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="http://qldt.actvn.edu.vn/CMCSoft.IU.Web.info/LostPassword.aspx"
                                      variant="body2">
                                    Quên mật khẩu
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright/>
                </Box>
            </Container>
        );
    }
}

export default withStyles(useStyles)(SignIn)
