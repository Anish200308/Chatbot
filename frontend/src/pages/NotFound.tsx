import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigates back to the homepage
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
                backgroundColor: '#1c1c1c',
                padding: '20px',
            }}
        >
            <Typography variant="h1" sx={{ fontSize: '10rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                404
            </Typography>
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                Oops! The page you're looking for isn't here.
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '40px', color: '#666' }}>
                It looks like the page you are trying to visit doesn't exist. Please check the URL and try again.
            </Typography>
            <Box
                component="img"
                src="not found.jpeg" // Replace with the path to your 404 image
                alt="Not Found"
                sx={{ width: '300px', height: '300px', marginBottom: '30px', 
                    background:"dark"
                }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleGoHome}
                sx={{
                    backgroundColor: '#ff6b6b',
                    '&:hover': {
                        backgroundColor: '#ff4757',
                    },
                    padding: '10px 20px',
                    fontSize: '1.2rem',
                }}
            >
                Go Back to Home
            </Button>
        </Box>
    );
};

export default NotFound;
