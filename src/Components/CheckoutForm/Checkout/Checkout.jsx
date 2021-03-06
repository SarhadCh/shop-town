import React, { useState, useEffect } from 'react';
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';   
import  { commerce } from '../../../lib/Commerce';


import { Link } from 'react-router-dom';
import useStyles from './styles';
import { ContactSupportTwoTone } from '@material-ui/icons';
const steps = ['Shipping Address', 'Payment Details'];


const Checkout = ({cart, order, onCaptureCheckout, errorMessage}) => {
    const classes = useStyles(); 

    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});

    console.log(order);

    useEffect(() => { 
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'});
                setCheckoutToken(token);
            } catch (error) {
                console.log(error);
            }
        };

        generateToken();
    }, [cart]);

    const nextStep = () => setActiveStep(ps => ps+1);
    const backStep = () => setActiveStep(ps => ps-1);

    const next = (data) => {
        setShippingData(data);
        nextStep();
    };

    const Form = () => activeStep === 0 ? <AddressForm checkoutToken={checkoutToken} next={next}/> 
            : <PaymentForm  
                shippingData={shippingData}  
                checkoutToken={checkoutToken}  
                backStep={backStep} 
                onCaptureCheckout={onCaptureCheckout}
                nextStep = {nextStep}
            />

    const Confirmation = () => order.customer ? ( 
        <> 
            <div>
                <Typography variant='h5'> Thank you for your purchase {order.customer.firstName}</Typography>
                <Divider className = {classes.divider} />
                <Typography variant='subtitle2'> Order Reference: {order.customer_reference} </Typography>
            </div>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'> Back to Home </Button>
        </> 
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if(errorMessage) {
        <>
            <Typography variant='h5'> Error: {errorMessage}</Typography>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'> Back to Home </Button>
        </>
    }

    return (
        <>
            <div className = {classes.toolbar} />
            <main className = {classes.layout}>
                <Paper className = {classes.paper} >
                    <Typography variant = 'h4' align = 'center'> Checkout </Typography>
                    
                    <Stepper activeStep={activeStep} className={classes.stepper}> 
                        { steps.map(step => (
                               <Step key = {step}>
                                   <StepLabel> {step} </StepLabel>
                               </Step>
                        ))}
                    </Stepper>

                    {activeStep === steps.length ? <Confirmation /> : checkoutToken &&  <Form />}
                </Paper>
            </main>
        </>
    )
}

export default Checkout; 
