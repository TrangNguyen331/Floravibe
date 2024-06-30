import React, { useEffect, useState } from "react";
import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PropTypes from "prop-types";
import PageTitle from "../components/Typography/PageTitle";
import {
  CartIcon,
  MoneyIcon,
  PeopleIcon,
  TruckIcon,
  CheckIcon,
  CancelIcon,
  RefreshIcon,
} from "../icons";
import RoundIcon from "../components/RoundIcon";
import { Card, CardBody, Label, Select } from "@windmill/react-ui";
import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
  barOptions,
  barLegends,
} from "../utils/demo/chartsData";
import axiosInstance from "../axiosInstance";
import StatisticProduct from "../components/StatisticProduct";
import { Box, Divider, Tab, Tabs, Typography, styled } from "@mui/material";
import TestOrderTable from "../components/TestOrderTable";
import UserStatistic from "../components/UserStatistic";

function Dashboard() {
  const [dashboard, setDashBoard] = useState({
    totalCustomer: "",
    totalIncome: "",
    totalNewOrder: "",
    totalShippingOrder: "",
    totalCancelOrder: "",
    totalCompleteOrder: "",
  });
  const StyledTabs = styled((props) => (
    <Tabs
      {...props}
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
    />
  ))({
    "& .MuiTabs-indicator": {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    "& .MuiTabs-indicatorSpan": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  });

  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: "none",
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      color: "rgba(255, 255, 255, 0.7)",
      "&.Mui-selected": {
        color: "#fff",
      },
      "&.Mui-focusVisible": {
        backgroundColor: "rgba(100, 95, 228, 0.32)",
      },
    })
  );
  // const StyledTabs = styled((props) => (
  //   <Tabs
  //     {...props}
  //     TabIndicatorProps={{
  //       children: <span className="MuiTabs-indicatorSpan" />,
  //     }}
  //   />
  // ))({
  //   "& .MuiTabs-indicator": {
  //     display: "flex",
  //     justifyContent: "center",
  //     backgroundColor: "transparent",
  //   },
  //   "& .MuiTabs-indicatorSpan": {
  //     // maxWidth: 60,
  //     height: "8px",
  //     width: "70%",
  //     backgroundColor: "#7e3af2",
  //   },
  // });
  // const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  //   ({ theme }) => ({
  //     textTransform: "none",
  //     fontWeight: 500,
  //     fontSize: theme.typography.pxToRem(20),
  //     marginRight: theme.spacing(1),
  //     color: "#97979c",
  //     "&.Mui-selected": {
  //       fontWeight: 600,
  //       fontSize: 22,
  //       color: "#7e3af2",
  //     },
  //     "&.Mui-focusVisible": {
  //       backgroundColor: "rgba(100, 95, 228, 0.32)",
  //     },
  //   })
  // );
  // CustomTabPanel.propTypes = {
  //   children: PropTypes.node,
  //   index: PropTypes.number.isRequired,
  //   value: PropTypes.number.isRequired,
  // };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={cusValue !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {cusValue === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const dashboardInfo = await axiosInstance.get(
          "/api/v1/about-us/dashboard"
        );
        setDashBoard(dashboardInfo.data);
        console.log("dashboardInfo", dashboardInfo.data);
      } catch (error) {
        console.log("Load data Error", error);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  const [filter, setFilter] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [cusValue, setCusValue] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const handleChange = (event, newValue) => {
    setCusValue(newValue);
  };
  // const handleFilter = (filter_name) => {
  //   // console.log(filter_name);
  //   if (filter_name === "All") {
  //     setRefresh(!refresh);
  //   }
  //   if (filter_name === "In Request Orders") {
  //     setFilter("IN_REQUEST");
  //   }
  //   if (filter_name === "In Progress Orders") {
  //     setFilter("IN_PROCESSING");
  //   }
  //   if (filter_name === "Cancel Orders") {
  //     setFilter("CANCEL");
  //   }
  //   if (filter_name === "Completed Orders") {
  //     setFilter("COMPLETED");
  //   }
  // };

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          disableHover
          title="New Orders"
          onClick={() => setFilter("IN_REQUEST")}
          value={dashboard.totalNewOrder || "0"}
        >
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4 cursor-pointer"
          />
        </InfoCard>

        <InfoCard
          disableHover
          title="Shipping Orders"
          onClick={() => setFilter("IN_PROCESSING")}
          value={dashboard.totalShippingOrder || "0"}
        >
          <RoundIcon
            icon={TruckIcon}
            iconColorClass="text-pink-500 dark:text-pink-100"
            bgColorClass="bg-pink-100 dark:bg-pink-500"
            className="mr-4 cursor-pointer"
          />
        </InfoCard>

        <InfoCard
          disableHover
          title="Complete Orders"
          value={dashboard.totalCompleteOrder || "0"}
          onClick={() => setFilter("COMPLETED")}
        >
          <RoundIcon
            icon={CheckIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4 cursor-pointer"
          />
        </InfoCard>

        <InfoCard
          disableHover
          title="Cancel Orders"
          onClick={() => setFilter("CANCEL")}
          value={dashboard.totalCancelOrder || "0"}
          disabled
        >
          <RoundIcon
            icon={CancelIcon}
            iconColorClass="text-gray-500 dark:text-gray-100"
            bgColorClass="bg-gray-100 dark:bg-gray-500"
            className="mr-4 cursor-pointer"
          />
        </InfoCard>

        <InfoCard
          disableHover
          title="Total Customers"
          value={dashboard.totalCustomer || "0"}
        >
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="totalCustomer mr-4"
          />
        </InfoCard>

        <InfoCard
          disableHover
          title="Total Income"
          value={
            (dashboard.totalIncome &&
              dashboard.totalIncome.toLocaleString("vi-VN")) + " ₫" || ""
          }
        >
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-purple-500 dark:text-purple-100"
            bgColorClass="bg-purple-100 dark:bg-purple-500"
            className="totalIncome mr-4"
          />
        </InfoCard>
      </div>
      {/* <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="User Analytics">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>

        <ChartCard title="Revenue">
          <Bar {...barOptions} />
          <ChartLegend legends={barLegends} />
        </ChartCard>
      </div> */}

      <Box sx={{ width: "100%" }}>
        <Box sx={{ bgcolor: "#2e1534" }}>
          <StyledTabs
            value={cusValue}
            onChange={handleChange}
            aria-label="styled tabs example"
          >
            <StyledTab label="Orders" {...a11yProps(0)} />
            <StyledTab label="Statistic Product" {...a11yProps(1)} />
            <StyledTab label="Customers" {...a11yProps(2)} />
          </StyledTabs>
          <Divider className="mt-3" variant="middle" />
          <CustomTabPanel value={cusValue} index={0}>
            <TestOrderTable
              resultsPerPage={resultsPerPage}
              setResultsPerPage={setResultsPerPage}
            />
          </CustomTabPanel>
          <CustomTabPanel value={cusValue} index={1}>
            <>
              <StatisticProduct />
            </>
          </CustomTabPanel>
          <CustomTabPanel value={cusValue} index={2}>
            <UserStatistic />
          </CustomTabPanel>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
