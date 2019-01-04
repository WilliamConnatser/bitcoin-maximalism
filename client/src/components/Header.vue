<template>
  <ul id="menu">
    <li data-menuanchor="bitcoin-maximalism" class="active"><a href="#bitcoin-maximalism" id="main">Bitcoin Maximalism</a>
      <a href="#bitcoin-maximalism" class="small">Intro</a></li>
    <li data-menuanchor="protagonistic"><a href="#protagonistic">Pros</a></li>
    <li data-menuanchor="antagonistic"><a href="#antagonistic">Cons</a></li>
    <li data-menuanchor="terms"><a href="#terms">Terms</a></li>
    <li data-menuanchor="privacy"><a href="#privacy">Privacy</a></li>
  </ul>
</template>

<script>
  export default {
    name: "Header"
  };
</script>

<style>
  #menu-line {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 159px;
    height: 2px;
    background: #fff
  }

  #menu {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 70;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    letter-spacing: 1px;
    font-size: 1.1em;
  }

  #menu li {
    display: inline-block;
    margin: 10px 0;
    position: relative
  }

  #menu a {
    text-decoration: none;
    color: #fff;
    padding: 0 1.1em 1.1em 1.1em
  }

  #menu li.active a:after {
    content: '';
    margin: 0 1.1em 0 1.1em;
    height: 2px;
    background: #fff;
    display: block;
    position: absolute;
    bottom: -6px;
    left: 0;
    right: 0;
    display: block
  }

  @media screen and (min-width: 900px) {
    .small {
      display: none
    }
  }

  @media screen and (min-width: 550px) and (max-width: 900px) {
    .small {
      display: none
    }

    #menu {
      font-size: 1em;
    }
  }

  @media screen and (max-width: 550px) {
    #main {
      display: none
    }

    #menu {
      font-size: 0.9em;
    }

    #menu a {
      color: #fff;
      padding: 0 0.5em 1.1em 0.5em
    }
  }
</style>