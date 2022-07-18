# JUNO · Asset Management System #
## Mawson Infrastructure Group Inc. ##

## Front-End ##
### TODO: General ###
----
* Implement page system for longer lists!!!
* Clean up CSS in general.
* Reconfigure CORS (backend).
* Add tooltip or display proper formatting for acceptable .csv files.
* Export to PDF feature.
* Export to Excel feature.
* Create Users table for different accessibility (Username, Pass, Name, Email, Access Level).
* Add access levels to various maintenance features.
* Create front-page with 2-factor authentication.
* Make the list sortable in reverse.

### TODO: Specific Features ###
-----
#### Asset List ####
* Make asset lists have a page system as opposed to scroll.
#### Bulk Upload ####
* Check for duplicates in .csv file (from accidentally scanning device twice, etc.)
* Do not allow uploads if job sites in .csv do not exist!
#### Single Upload ####
* Implement server middleware specifically for individual asset upload cases (duplicates).
#### Single Asset Component ####
* Make all fields editable.
* Add functionality for "move", "delete", and "edit"
#### Notification Tracker ####
* Bug: Do not update notification tracker if uploads/actions failed.
#### History Log ###
* Potentially find historical data by user, or filter by action taken.
* Add ability to delete a history log (via Admin).
#### Navigation Guide (dropdowns) ####
* Add navigation for "Rack" (Site, MDC, Rack, Shelf, Unit)
* Add "Repairs, Storage, Retired" to Location dropdown.
#### Admin Panel ####
* Add manage users UI?
* ~~Make delete icon have an active styling.~~
* Make component re-render upon deleting job site.


#### Completed ####
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