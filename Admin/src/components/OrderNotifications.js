import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const OrderNotifications = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    // const socket = new SockJS("/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log("Connected: " + frame);

      stompClient.subscribe("/topic/orderUpdates", (message) => {
        const order = JSON.parse(message.body);
        setOrders((prevOrders) => [...prevOrders, order]);
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <h2>Order Updates</h2>
    </div>
  );
};

export default OrderNotifications;
