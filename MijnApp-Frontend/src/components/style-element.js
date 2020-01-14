import uno from './../assets/uno/uno.pcss';

const styleElement = document.createElement('dom-module');
styleElement.innerHTML =
  `<template>
    <style>
      ${uno};
    </style>
  </template>`;
styleElement.register('style-element');