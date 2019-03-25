SASS:
    - Project requires SASS. 
    - Main SASS file is popup.scss which is compiled to popup.css
    - All other containers or UI components should be in their own  SASS file with the name "_<uicomponent_name>.scss"
    - In addition to the component sass file, an import statement should be added to popup.scss at the end using "@import: <uicomponent_name>
    - popup.scss need to be compiled every time a change is made to an scss file
        - Use "sass <path_to_scss_file> <path_to_css_file>" or "sass --watch <path_to_scss_file> <path_to_css_file>" which will continually look for changes

General Project Structure:
    - Project is essentially a single webpage with all of its components loaded on to top of each other and hidden.
    - Each time the extension is opened popup.js, which is currently the main driver for the extension, then decides which UI component needs to be loaded.
    - Any required scripts should be declared in popup.html in either head or body depending on the use
    - Additional resources that need to be accessed (including domains) need to be declared in manifest.json in either the security policy or web accessible resources (depends on the use)
    
    
    