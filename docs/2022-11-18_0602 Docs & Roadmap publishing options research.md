
# Game plan
- For roadmap & tasks
    - Write in Obsidian
        - Dataview / Obsidian card to help manage projects
    - Dendron to export / import markdown from Github issues
        - Potentialy write in Dendron? To be explored
    - Roadmap in Github Projects
- For docs
    - Start with Obsidian publish (for simplicity)
    - Try out Flowershow & Mintlify (for extensibility)
    - Docusaurus as last resort
- Aside
    - Generate markdown from zod schema & ts interface
    - Try building a whole new homepage 

# Next steps
- [x] Try out Dendron's import & export ✅ 2022-11-18
    - Importing from github does not dedupe based on `id`, but creates duplicates if issue name changes
    - Publishing to github only works for metadata. The title / body are not updated for existing issues so those are one-time upload
- [ ] Setup shared Obsidian proper in Venice repo

# Comparison table
| Name                                               | Pros                                                         | Cons                                                         |
| -------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Obsidian Publish                                   | - Most familiar to the devs <br>- Backlinking & graph view<br />- Easiest to setup & cutomize (`publish.{js,css}`)<br />- Collaborators can use Obsidian vault to manage the project<br />- Tons of alternatives popping up ([Flowershow](https://forum.obsidian.md/t/flowershow-a-free-open-source-tool-for-publishing-your-obsidian-vaults/41966), Mindstone, [mkdocs publisher](https://forum.obsidian.md/t/obsidian-mkdocs-publisher-a-free-publish-alternative/29540), [userland publish](https://github.com/obsidian-userland/publish), [Pubsidian](https://forum.obsidian.md/t/pubsidian-free-and-elegant-obsidian-publish-alternative/21825/47), etc) | - Dynamic rendering <br>- Community plugins not supported anyways <br>- No full text search<br />- Hard to do advanced customization<br />- No support for CI-based publish from git <br />  (have to run from within Obsidian on dev machine) |
| [Obsidan flowershow](https://flowershow.app/)      | - Experienced team, active dev & biz model<br />- OSS customizable based on Next.js (Yay SSR) <br/>- Tailwind css<br />- Full text search (option to power by Algol)<br />- CLI integration | - JS based<br />- Links to headings, blocks & transclusions not yet supported |
| [Obsidian Mindstone](https://mindstone.tuancao.me) | - Works with Obsidian <br>- OSS customizable based on Next.js (Yay SSR) | - No active development for 7 months <br>- No full text search |
| [Dendron](https://www.dendron.so/)                 | - OSS customizable based on Next.js (Yay SSR) <br>- Full text search<br />- [Pods](https://wiki.dendron.so/notes/PuDUEyUAPmvpBvaFWHDOS/) are incredible! (Can be used to update Github issues / Airtable) | - Ugly page urls (id only) <br>- Confusing navigation (e.g. no breadcrumb) |
| Docusaurus                                         | - Defacto standard for publishing docs                       |                                                              |
| Mintlify                                           | - Amazing support <br>- Analytics focused                    | - (Probably) does not work with Obsidian features (wiki links, backlinks, etc) |
| Github Projects, Issues & Wiki                     | - Kanban support out-of-box<br />- Best for community engagement & contribution | - Github projects does not work offline                      |

