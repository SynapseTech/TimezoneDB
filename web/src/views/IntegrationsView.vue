<script setup lang="ts">
	import Page from '../components/Page.vue';
	import {
		faChrome,
		faFirefox,
		faEdge,
		faDiscord,
	} from '@fortawesome/free-brands-svg-icons';
</script>

<template>
	<Page>
		<div class="container bg-white flex-grow p-4 mx-auto text-center">
			<h1 class="pageHeading">Browser Extensions</h1>
			<section class="integrationsSection">
				<a
					href="https://chrome.google.com/webstore/detail/timezonedb/pnaipdklkdgobgkhkkimnbdfhenkcfga"
					class="integration interactive"
				>
          <div class="lead">
            <div class="platformIcon">
              <font-awesome-icon
                :icon="faChrome"
                fixed-width
              ></font-awesome-icon>
            </div>
            <div class="text">
              <span class="name">Chrome</span>
            </div>
          </div>
				</a>
				<a class="integration disabled" aria-disabled="true">
          <div class="lead">
            <div class="platformIcon">
              <font-awesome-icon
                :icon="faFirefox"
                fixed-width
              ></font-awesome-icon>
            </div>
            <div class="text">
              <span class="name">Firefox</span>
              (Coming Soon)
            </div>
          </div>
				</a>
				<a class="integration disabled" aria-disabled="true">
          <div class="lead">
            <div class="platformIcon">
              <font-awesome-icon
                :icon="faEdge"
                fixed-width
              ></font-awesome-icon>
            </div>
            <div class="text">
              <span class="name">Edge</span>
              (Coming Soon)
            </div>
          </div>
				</a>
			</section>

			<h1 class="pageHeading">Other Integrations</h1>
			<section class="integrationsSection">
				<a
					class="integration interactive discord"
					download="timezonedb-powercord.zip"
					href="https://downloads.synapsetech.workers.dev/tzdb-powercord-v0.1.0-release.zip"
				>
          <div class="lead">
            <div class="platformIcon">
              <font-awesome-icon
                :icon="faDiscord"
                fixed-width
              ></font-awesome-icon>
            </div>
            <div class="text">
              <span class="name">Download for Powercord</span>
            </div>
          </div>
				</a>
			</section>

      <h1 class="pageHeading">Community Integrations</h1>
      <section class="integrationsSection">
        <div
          class="integration discord"
        >
          <div class="lead">
            <div class="platformIcon">
              <font-awesome-icon
                :icon="faDiscord"
                fixed-width
              ></font-awesome-icon>
            </div>
            <div class="text">
              <span class="name">Discord bot</span>
            </div>
          </div>

          <div class="body">
            <p class="text-left">
              A simple Discord bot to fetch the timezone of anyone, powered by TimezoneDB. Made by <a
                href="https://github.com/astridlol"
                target="_blank"
                rel="noreferrer noopener"
              >Astrid</a>.
            </p>
            <div class="buttons">
              <a
                class="btn discord"
                target="_blank"
                rel="noreferrer nooopener"
                href="https://discord.com/oauth2/authorize?client_id=1010203426291974164&permissions=264256&scope=bot%20applications.commands"
              >
                Add to your server
              </a>

              <a
                class="btn github ml-2"
                target="_blank"
                rel="noreferrer nooopener"
                href="https://github.com/astridlol/TimezoneBot"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
		</div>
	</Page>
</template>

<style scoped lang="scss">
	@import '../styles/text';
	@import '../styles/colors';
  @import '../styles/button';

  .pageHeading {
    @apply mt-12;
  }

	.integrationsSection {
		@apply grid grid-cols-1 lg:grid-cols-3 auto-cols-fr w-full gap-2 my-4;

		.integration {
			@apply bg-gray-200 rounded flex flex-col;

      &.interactive {
        @apply cursor-pointer;

        &:hover:not(.disabled) {
          @apply bg-gray-300;
        }
      }

      .lead {
        @apply flex items-center h-full;

        .platformIcon {
          @apply text-4xl flex justify-center items-center p-2;
        }

        .text {
          @apply flex flex-col justify-center items-start p-2 pl-0;

          .name {
            @apply font-semibold text-lg;
          }
        }
      }

      .body {
        @apply p-2 text-lg flex flex-col items-start;

        p {
          @apply mx-1;
        }

        a:not(.btn) {
          @apply transition transition-colors ease-in-out;

          &:hover {
            @apply underline text-sky-500;
          }
        }

        .buttons {
          @apply mt-4 flex items-end;

          .btn {
            @apply inline-flex items-center w-auto;
          }
        }

      }

			&.disabled {
				@apply cursor-default;
			}

			&.discord {
        .lead .platformIcon {
          color: $discord;
        }

        &.interactive:hover:not(.disabled) {
          .lead .platformIcon {
            color: darken($discord, 10);
          }
        }
			}
		}
	}
</style>
