using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using Xamarin.Forms;
using Plugin.Geolocator;
using System.Threading.Tasks;
using Plugin.Geolocator.Abstractions;
using Geolocation;

namespace OAuthTester.Views.Exercise
{
    public class ActivityGPS : ContentPage
    {
        // private DispatcherTimer dispatcherTimer;
        private int time = 0;

        // initialise locator
        private IGeolocator locator = CrossGeolocator.Current;
        private Position position = null;
        private double distance = 0;

        private Label timer = new Label
        {
            FontSize = 48,
            Text = "0:00"
        };
        private Label lblLocation = new Label
        {
            Text = "Getting location..."
        };
        private Label lblDistance = new Label
        {
            Text = "0.0km"
        };
        private Button btnStartStop = new Button
        {
            Text = "Start"
        };

        public ActivityGPS() : this("Run")
        {
        }

        public ActivityGPS(String title)
        {
            locator.DesiredAccuracy = 10;
            var Title = new Label
            {
                Text = title
            };

            var btnOk = new Button
            {
                Text = "Ok"
            };
            btnOk.Clicked += (sender, eventArgs) => {
                Navigation.PopModalAsync();
            };
            btnStartStop.Clicked += startStopTimer;
            Content = new StackLayout
            {
                Spacing = 0,
                VerticalOptions = LayoutOptions.CenterAndExpand,
                HorizontalOptions = LayoutOptions.CenterAndExpand,

                Children =
                {
                    Title,
                    timer,
                    btnStartStop,
                    lblLocation,
                    new StackLayout
                    {
                        Spacing = 2,
                        Orientation = StackOrientation.Horizontal,
                        Children =
                        {
                            new Label
                            {
                                Text = "Distance"
                            },
                            lblDistance
                        }
                    },
                    new StackLayout
                    {
                        Spacing = 2,
                        Orientation = StackOrientation.Horizontal,
                        Children = {
                            new Label
                            {
                                Text = "Split:"
                            },
                            new StackLayout
                            {
                                Children =
                                {
                                    new Label
                                    {
                                        Text = "1. 4:52"
                                    },
                                    new Label
                                    {
                                        Text = "2. 9:23"
                                    },
                                    new Label
                                    {
                                        Text = ""
                                    }
                                }
                            }
                        }
                    },
                    new StackLayout
                    {
                        Orientation = StackOrientation.Horizontal,
                        Spacing = 2,
                        Children =
                        {
                            new Label
                            {
                                Text = "Pace:"
                            },
                            new Label
                            {
                                Text = "12.24 km/h"
                            }
                        }
                    },
                    btnOk
                }
            };
        }

        private bool active = false;
        private int locCount = 0;
        private void startStopTimer(Object sender, EventArgs eventArgs)
        {
            if (!active)
            {
                // start clock display:
                active = true;
                Device.StartTimer(new TimeSpan(0,0,1), timer_Tick);
                var task = Task.Run((Action)getLocation);
                CrossGeolocator.Current.PositionChanged += (sndr, e) => {
                    locCount++;
                    position = e.Position;
                };                

                btnStartStop.Text = "Stop";
            }
            else
            {
                // stop timer
                active = false;
                btnStartStop.Text = "Continue";
            }
        }

        private bool timer_Tick()
        {
            if (!active)
            {
            //    Task.Run((Action)getLocation);
                return false;
            }
            if (time % 10 == 0)
            {
                Task.Run((Action)getLocation);
            }
            time++;
            this.timer.Text = String.Format("{0}:{1:D2}", time / 60, time % 60);
            if (position != null)
            {
                lblLocation.Text = locCount + ":" + position.Latitude + "," + position.Longitude;
                if (distance < 1)
                {
                    lblDistance.Text = (distance * 1000) + "m";
                } else
                {
                    lblDistance.Text = distance + "km";
                }
            }

            return true;
        }

        bool retry = false;
        private async void getLocation()
        {
            Position result = null;
            try
            {
                result = await CrossGeolocator.Current.GetPositionAsync(timeoutMilliseconds: 10000);
            } catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e.ToString());
                // retry once:
                if (!retry)
                {
                    retry = true;
                    var task = Task.Run((Action)getLocation);
                    return;
                }
                else
                {
                    retry = false;
                    position = new Position();
                    position.Latitude = -1;
                    position.Longitude = -1;
                    return;
                }

            };
            if (position != null)
            {
                
                var dist = GeoCalculator.GetDistance(position.Latitude, position.Longitude, result.Latitude, result.Longitude, 3);
                System.Diagnostics.Debug.WriteLine(dist);
                distance += dist / 0.62137;
            }
            position = result;
        }
    }
}
