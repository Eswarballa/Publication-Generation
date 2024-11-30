Here's a comprehensive README file for the RepoSync plugin:

# RepoSync - Research Publication Listing Plugin

RepoSync is a versatile and customizable plugin that allows you to seamlessly integrate a research publication listing feature into your website. With its intuitive search and filter capabilities, RepoSync empowers your users to easily discover and explore publications from leading academic sources.

## Key Features

- **Automatic Publication Sync**: Fetch publication data directly from Google Scholar using the SerpAPI integration.
- **Comprehensive Search**: Allow users to search for authors and view their associated publications.
- **Robust Filtering**: Enable users to filter publications by publication year.
- **Responsive and Customizable Design**: Adapt the plugin's appearance to match your website's branding and styling.
- **Pagination and Performance**: Efficiently handle large volumes of publications with pagination and optimized loading.
- **Easy Integration**: Integrate the plugin into your website with minimal setup and configuration.

## Getting Started

To get started with RepoSync, follow these steps:

1. **Include the Necessary Files**: Add the RepoSync CSS and JavaScript files to your website's HTML structure. Place the `<link>` tag for the CSS file in the `<head>` section, and the `<script>` tag for the JavaScript file at the bottom of the `<body>` section.

   ```html
   <head>
     <!-- ... -->
     <link rel="stylesheet" href="reposync.min.css" />
   </head>
   <body>
     <!-- ... -->
     <script src="reposync.min.js"></script>
   </body>
   ```

2. **Create a Container Element**: Provide a container element, typically a `<div>`, where the plugin will be rendered. This element should have a unique identifier, such as an `id` attribute.

   ```html
   <div id="reposync"></div>
   ```

3. **Initialize the RepoSync Plugin**: In your website's JavaScript file or within a `<script>` tag at the bottom of the HTML file (after the necessary HTML structure and CSS/JS includes have been set up), create an instance of the `RepoSync` class and configure it according to your needs.

```    <!-- Container for publications -->
    <div id="reposync"></div>

    <!-- Add the script with full path -->
    <script src="X:/home/gshukla/Project/Project/dist/reposync.min.js"></script>
    
    <script>
        // Add error handling for script loading
        window.addEventListener('load', function() {
            if (typeof RepoSync === 'undefined') {
                console.error('RepoSync script failed to load');
                document.getElementById('reposync').innerHTML = 
                    'Error: RepoSync plugin failed to load. Please check the console for details.';
                return;
            }

            try {
                new RepoSync({
                    scholarId: "ds5hIzoAAAAJ",
                    title: "Dr. Sai Anirudh Karre - Publications"
                });
            } catch (error) {
                console.error('Error initializing RepoSync:', error);
                document.getElementById('reposync').innerHTML = 
                    'Error: Failed to initialize RepoSync. Please check the console for details.';
            }
        });
    </script>```

Here's an example of where the initialization code would go in your HTML file:

   ```<!DOCTYPE html>
<html>
<head>
    <title>Publications</title>
</head>
<body>
    <!-- Container for publications -->
    <div id="reposync"></div>

    <!-- Add the script with full path -->
    <script src="X:/home/gshukla/Project/Project/dist/reposync.min.js"></script>
    
    <script>
        // Add error handling for script loading
        window.addEventListener('load', function() {
            if (typeof RepoSync === 'undefined') {
                console.error('RepoSync script failed to load');
                document.getElementById('reposync').innerHTML = 
                    'Error: RepoSync plugin failed to load. Please check the console for details.';
                return;
            }

            try {
                new RepoSync({
                    scholarId: "ds5hIzoAAAAJ",
                    title: "Dr. Sai Anirudh Karre - Publications"
                });
            } catch (error) {
                console.error('Error initializing RepoSync:', error);
                document.getElementById('reposync').innerHTML = 
                    'Error: Failed to initialize RepoSync. Please check the console for details.';
            }
        });
    </script>
</body>
</html>
   ```
   The key is to ensure that the RepoSync JavaScript file is included before the initialization code, so that the `RepoSync` class is available to be instantiated.

4. **Customize the Appearance (Optional)**: Modify the plugin's CSS to align with your website's design.

   ```css
   .reposync-wrapper.dark {
     background-color: #1e293b;
     color: #fff;
   }

   .reposync-wrapper .search-input {
     border-color: #334155;
   }
   ```

Check out the [examples](examples/) directory for more detailed integration scenarios, including a basic integration, an advanced integration with custom styling, and a demo of the plugin's search and filtering capabilities.

## Configuration Options

The `RepoSync` class accepts the following configuration options:

| Option         | Type     | Default                   | Description                                                    |
| -------------- | -------- | ------------------------- | -------------------------------------------------------------- |
| `container`    | `string` | `'#reposync'`             | The CSS selector for the container element.                    |
| `apiUrl`       | `string` | `'http://localhost:3001'` | The URL of the backend API that provides the data.             |
| `theme`        | `string` | `'light'`                 | The theme for the plugin, can be `'light'` or `'dark'`.        |
| `itemsPerPage` | `number` | `10`                      | The number of publications to display per page.                |
| `features`     | `array`  | `['search']`              | The features to enable, can include `'search'` and `'filter'`. |

## Contributing

We welcome contributions to the RepoSync project! If you encounter any issues, have suggestions for improvements, or would like to contribute new features, please feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/Eswarballa/Publication-Generation).

## License

This project is licensed under the [IIIT Hyderabad License](LICENSE).
