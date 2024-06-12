import React, { useState, useEffect} from "react";
import { Grid, Typography, Pagination } from '@mui/material';

const Paginate = ({totalPages, totalResults, page, onPageChange}) => {
    return(
        <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
            <Grid item>
                <Typography component="span" sx={{ fontSize: 14 }}>Total Page:</Typography>
                <Typography component="span" sx={{ fontSize: 14, fontWeight: 'bold'}}> {totalPages} </Typography>
                <Typography component="span" sx={{ fontSize: 15, pr: 2, pl: 2 }}>|</Typography>
                <Typography component="span" sx={{ fontSize: 14 }}>Total Items:</Typography>
                <Typography component="span" sx={{ fontSize: 14, fontWeight: 'bold' }}> {totalResults}</Typography>
            </Grid>
            <Grid item>
                <Pagination 
                    count={totalPages} 
                    page={page} 
                    defaultPage={1}
                    onChange={onPageChange} 
                    sx={{
                        '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: '#7e3af2',
                        color: '#fff',
                        border: 0,
                        },
                    }}
                    showFirstButton
                    showLastButton
                />
            </Grid>
        </Grid>
    );
};

export default Paginate;