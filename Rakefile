desc "Start scraping (given an google email & password and the url to post the values to)" 
task :run, [:google_analytics_email, :google_analytics_password, :push_url] do |t, args|
    sh "casperjs/bin/casperjs main.js #{args.google_analytics_email} '#{args.google_analytics_password}' '#{args.push_url}'"
end
 
