# JUNO · Asset Management System #
## Mawson Infrastructure Group Inc. ##

## Front-End ##
### TODO: General ###
----
* Clean up CSS in general.
* Reconfigure CORS (backend).
* Add tooltip or display proper formatting for acceptable .csv files.
* Export to PDF feature.
* Export to Excel feature.
* Finish threading users throughout App.
* Make the lists sortable in reverse.

### TODO: Specific Features ###
-----
#### Login ####

* Add LoaderSpinner and remove login button on first onClick.
* ~~Set timeout (logout after so long)~~
* Log user out if deleted from DB.
* ~~Submit on 'enter' press.~~
* ~~Add LoaderSpinner when loading login component.~~
* ~~Validation, validation, validation.~~
#### Asset List ####
* Styling.
* ~~Add set amount per page input.~~
#### Bulk Upload ####
* Do not allow uploads if job sites in .csv do not exist!
* ~~Check for duplicates in .csv file (from accidentally scanning device twice, etc.)~~
#### Single Upload ####
* ~~More backend validation.~~
#### Upload Log ####
* ~~Fix styling issue where texts goes outside of container.~~
* ~~Fix issue where upload log renders before successful/failed web request..~~
#### Single Asset Component ####
* Validate submitted updated information via editing asset.
* Add functionality for "move", ~~"delete", and "edit".~~
* ~~Make all fields editable.~~
#### Notification Tracker ####
* ~~Update notifications via history_log table, not individual asset data.~~
* ~~Bug: Do not update notification tracker if uploads/actions failed.~~
#### History Log ###
* ~~Create a log for job sites created by.~~
* ~~Created a log for history log deactivated by.~~
* ~~Potentially find historical data by user, or filter by action taken.~~
#### Navigation Guide (dropdowns) ####
* Add navigation for "Rack" (Site, MDC, Rack, Shelf, Unit)
* Add "Repairs, Storage, Retired" to Location dropdown.
#### Admin Panel ####
* ~~Build out UI for creating and editing users.~~
* ~~Add LoaderSpinner when loading.~~
* ~~Make component re-render upon deactivating job site.~~
* ~~Add manage users UI?~~


#### Completed ####
* ~~Add login details to each page, not just asset list component.~~
* ~~Add logged-in user data to any historical moves.~~
* ~~Create front-page with login.~~
* ~~Make asset lists have a page system as opposed to scroll.~~
* ~~Make delete icon have an active styling.~~
* ~~Implement page system for longer lists!!!~~
* ~~Style upload button and style containers.~~
* ~~Remove API calls from useEffect!!!!~~
* ~~Create a log of upload success (500 assets added successfully, 88 fails - and reasons, etc.)~~
* ~~Disable "upload" button after first submit.~~
* ~~Render Successes/Failures.~~
* ~~Make line numbering of successes dynamic in upload log.~~
* ~~Add invoice number to optionally add invoice # at later date.~~
* ~~Render upload log of metadata.~~
* ~~Add "value" property to asset (base value from invoice numbers, to see depreciation value over life of units.)~~
* ~~Delete requires confirmation.~~
* ~~Dashboard renders component with 5(?) latest "moves" with "view all" link at the bottom that will render a log of ALL moves.~~
* ~~Make log sortable by date and date range.~~
* ~~Generate a key when creating a new historical log.~~
* ~~Create Manage Job Sites Component with delete, list capabilities of all job sites (with confirmation).~~
* ~~Make navigation buttons differentiate with active/non-active styling.~~
* ~~Fix bug where app will not load if asset lists are empty. (Either populate one item to be replaced, or change render conditions.)~~
* ~~Added styled scrollbars.~~
* ~~Add download .csv template to bulk upload component.~~
* ~~Create "Loading" bar for loading assets and various components.~~
* ~~Make a "catch" for when the donut chart has no data to render - do not render until after everything is loaded.~~
* ~~Create single asset page that includes all the previously rendered data, but also "History" and "Comments".~~
* ~~Seed more data to make larger DB tests.~~
* ~~Implement the functionality of the drop down menu to switch between job sites and rendering appropriate data.~~
* ~~Render data by all job sites, individual job sites, and locations within job sites (DRAP, Warehouse, Repair, etc).~~
* ~~Add ability to "sort" assetList by each assetList property (asset_tag, site, make, model, HP, status, last_updated).~~
* ~~Pie chart showing % of machine state.~~
* ~~Implement a uniform site name/code. Going with "Midland, PA" styling.~~
* ~~Update Asset Tables to include "comments" so each individual asset page will have "comment section" of only so many characters.~~
* ~~Make NavGuide select-options dynamic (to whatever is available in DB).~~
* ~~Update "Viewing" so it renders the correct location from Search when asset loads/is found.~~
* ~~Add "Viewing" or Location status to Asset Tracker.~~
* ~~Implement a Single/Bulk upload feature. Single - form data, Bulk - .csv stream.~~