# Insights

As our business grew, we faced a dilemma: we had little visibility into our data.

Questions such as *"who is our best customer?"*, *"which target countries are gaining in sales?"* or *"what are our most popular categories for paid leads?"* required tinkering in the Rails console or writing custom stats pages. We lost *a lot* of developer time over the years.

So we started looking for the best **Business Intelligence** solution out there.

Unfortunately, they all had their problems. Some required knowledge of SQL. Some made multi-table data exploration a pain. Most cost an arm, a leg and an iPhone. Per month.

The best tool we found was [Looker](https://looker.com/), but at a monthly price equal to our burn rate, it wouldn't work.

So I decided to re-implement the essential parts of Looker as an open source alternative.

**Insights** is a self-hosted "SQL-not-required" data analytics and business intelligence tool. It's a work in progress and you're brave for checking it out! Cheers!

[Play with the demo here.](http://insights-demo.mariusandra.com/)

![Screenshot of the Explorer](https://github.com/mariusandra/insights/raw/master/doc/screenshot.png)

## How does it work

Similar to Looker and their LookML, insights requires you to define your data model in a file called [`insights.yml`](https://github.com/mariusandra/insights_demo/blob/master/config/insights.yml).

You use the [`insights_export`](https://github.com/mariusandra/insights_export) gem to generate this file from your Rails Models. (Adapters for other frameworks coming soon.)

You keep this file in your source repository and update whenever something changes. You edit it to add custom fields (`full_name: first_name || ' ' || last_name`), hide existing fields (e.g. `encrypted_password`) or hide entire models.

When your database changes, run `rake insights:export` and the file is updated automatically.

One entry in this file looks like this:

```yaml
Order:
  enabled: true  # set to false to hide
  model: Order
  table_name: orders
  primary_key: id
  columns:
    id:
      type: :number
      index: :primary_key
    total_price:
      type: :number
    hidden_field: false # this stays hidden
    currency:
      type: :string
    # ...
  custom:
    total_price_in_eur:
      sql: "$$.total_price * $$.currency_to_eur"
      type: :number
  links:
    incoming:
      order_lines:
        model: OrderLine
        model_key: order_id
        my_key: id
    outgoing:
      user:
        model: User
        model_key: id
        my_key: user_id
```

## Installing

Installing `insights` is a two-part process:

### 1. Export your app's structure

First you need to create an [`insights.yml`](https://github.com/mariusandra/insights_demo/blob/master/config/insights.yml) file from your main Rails application. This file will describe your database structure,
including custom fields and aliases that you may define.

#### 1.1. Generate an `insights.yml` file from your Rails app.

Add `gem 'insights_export'` to your `Gemfile` and run:

```
rake insights:export
```

The generated `config/insights.yml` file needs to be accessible for `insights` in the next steps. I recommend keeping it in your
app's repository and running `rake insights:export` each time your database structure changes to update it. You can then symlink it to `insights`.

### 2. Install Insights

#### 2.1. Git clone (or fork and clone) the repository

```
git clone https://github.com/mariusandra/insights
cd insights
```

#### 2.2. Install the ruby (~2.3) and nodejs (6+) packages:

```
bundle
yarn
```

Make sure the above commands succeed!

#### 2.3. Setup the database

Copy `config/database.yml.example` to `config/database.yml`

Edit `config/database.yml` and change the `target_database:` block to point to your app's database.

Feel free to keep the `development` database as SQLite for now, although you might want to use something else in production.

Init the database:

```
bundle exec db:create
bundle exec db:schema:load
```

#### 2.4. Set up the path to `insights.yml` in `config/initializers/insights.rb`
(copy from `config/initializers/insights.rb.example`)

Anything like this, depending on your setup and the location of the file:

```
INSIGHTS_EXPORT_PATH = "#{Rails.root}/insights.yml"
INSIGHTS_EXPORT_PATH = '../my-app/config/insights.yml'
INSIGHTS_EXPORT_PATH = '/srv/my-app/current/config/insights.yml'
```

#### 2.5. Set up the credentials in `config/initializers/insights.rb`

*(Coming soon. There is no authentication yet!)*

#### 2.6. Run it!

```
foreman start
```

and open [`http://localhost:3300`](http://localhost:3300)
