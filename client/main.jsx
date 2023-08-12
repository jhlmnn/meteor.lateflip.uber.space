import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';

Meteor.startup(() => {
  // const container = document.getElementById('react-target');
  // const root = createRoot(container);
  // root.render(<App />);

  if (Meteor.isClient){
    const mode = "sandbox";
    const volt = new window.Volt({mode});

    console.log("Hello this is the client!");

    const payment = {
    "id": "1e0622ac-0172-424a-b9dc-50301c9da2ef",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTE3OTEzNzEsImV4cCI6MTY5MTc5MzE3MSwicGF5bWVudElkIjoiMWUwNjIyYWMtMDE3Mi00MjRhLWI5ZGMtNTAzMDFjOWRhMmVmIiwiY3VycmVuY3lJZCI6IkVVUiIsImN1c3RvbWVySWQiOiIyOTJkNDhmNi05MGYzLTQ1MGItOTNlYi0wYjQ4MGI4YjcwZGQifQ.CMj88xdeMm6Sn_5UEARZJ6nyNMe6PpPVOVEN6sTOXVyfmr1CgOU-vQ1dw2Lxhw7v__nKr46sjCvRDI4-vJubY5ViflGQjz9kb40SNpCdrmxQouAgxm7dp1zqRoHf5Py_YwaVCWwDTkxOztpURHPp3j7HaaHNpxu-6MeqYWjwv3nH7KXM5-tgxKEQSbYUF6DE1W6lWUBb-N5-9C_Dkg7MY6u0GOHxpy9kiZlTHE68lGaf5C3SXpMAhIt4rY6A4wJHZ1A69y-RetDwJlbH_Tb6teXtdhhJ59uGMd6ky7OOlfq8U2UBQbhW27eulJn_NkbNBzpXmFVb26fYfqv892UoI7w8BsQP8njHr5IlNSaVcl4gUYXWtqM-2oKJTZ7zfQ_27n8-uQeTOlZQjIq9ZOUtGsQdOGgNP7yjCln8zqQCqbo1F42J_bCVFEn7xwo9v2jI-Qn_hbUR-IGHwhETP6jN5fASTSbHLfXCKMpezSDhJGXgC1SPBWgRxGMKnddhDixNCYsCsQsTrOW5BTBaQedbVkxYX_nNxE9eIsqhG3zCtUNvOByZ5DNDoQarcmjw982uYsEKtTagnp87YPJrNDtvME_C0tMuSnJO3zeV6RzdUYTR7omB4Bm0I9Rtd_VRO3shhzvkhvbNICLcGCmOGS2CuH34XOaHy-o0DV0A0iOPfSE"
};

    const paymentContainer = volt.payment({
      payment
    });

    const paymentComponent = paymentContainer.createPayment();
    paymentComponent.mount("#volt-payment-component");
  }
});
