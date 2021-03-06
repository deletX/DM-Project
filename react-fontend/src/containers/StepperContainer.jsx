import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {Stepper} from "@material-ui/core";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import StepContent from "@material-ui/core/StepContent";
import {handleError} from "../utils/utils";
import {useSnackbar} from "notistack";

/**
 * Handle a stepper (see {@link Stepper})
 *
 * Enable stepper usage with less boilerplate.
 */
function StepperContainer(props) {
    const classes = useStyles();
    const {enqueueSnackbar,} = useSnackbar()
    const {getSteps, getStepContent, isStepValid, isStepOptional, clear, uploadData, finalButtonText} = props;
    const steps = getSteps();

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const disabled = !isStepValid(activeStep);

    /**
     * Tells weather `step` step has been skipped
     *
     * @param {number} step
     *
     * @return {boolean}
     */
    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    /**
     * Handles the next action
     */
    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    /**
     * Handles the back action
     */
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    /**
     * Handles the skip action
     */
    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            handleError(enqueueSnackbar, "You can't skip a step that isn't optional.");
        }
        clear(activeStep)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    /**
     * Reset the stepper cleaning each step and resetting the active step
     *
     * @param {boolean} keepData if only to go back to the first step keeping inputted data
     */
    const reset = (keepData) => {
        if (!keepData) {
            for (let step = activeStep; step >= 0; step--) {
                clear(step);
            }
        }
        setActiveStep(0);
    }

    useEffect(() => {
        if (activeStep === steps.length) {
            uploadData(reset, isStepSkipped)
        }
    })

    return (
        <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                    labelProps.optional = <Typography variant="caption">Optional</Typography>;
                }
                if (isStepSkipped(index)) {
                    stepProps.completed = false;
                }

                return (
                    <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                        <StepContent>
                            {getStepContent(index, handleNext, isStepSkipped)}
                            <div>
                                <Button disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={classes.button}>
                                    Back
                                </Button>
                                {isStepOptional(activeStep) && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSkip}
                                        className={classes.button}
                                    >
                                        Skip
                                    </Button>
                                )}

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                    disabled={disabled}
                                >
                                    {activeStep === steps.length - 1 ? finalButtonText : 'Next'}
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                );
            })}
        </Stepper>
    )
}


const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
}));


export default StepperContainer