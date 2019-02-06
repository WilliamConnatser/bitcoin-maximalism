<template>
    <ul id="footer">
        <li>&copy; YOLO International LLC</li>
        <li>
            <router-link to="/terms">Terms</router-link>
        </li>
        <li>
            <router-link to="/privacy">Privacy</router-link>
        </li>
        <li>
            <a href="https://github.com/WilliamConnatser/bitcoin-maximalism-v2" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'github-square' }" class="small-social-icons" />
            </a>
        </li>
        <li>
            <a href="https://twitter.com/BTCMaximalism21" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'twitter-square' }" class="small-social-icons" />
            </a>
        </li>
        <li>
            <a href="https://www.facebook.com/BitcoinMaximalism/" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'facebook-square' }" class="small-social-icons" />
            </a>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "Footer"
    };
</script>